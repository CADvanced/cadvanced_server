import http from 'http';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import passport from 'passport';
import Sequelize from 'sequelize';
import * as dotenv from 'dotenv';

import typeDefs from './db/Schema.js';
import resolvers from './db/Resolvers.js';
import Models from './db/Models/index.js';
import { stripTypename } from './middleware/ModifyRequest.js';
import initAuth from './helpers/Authentication.js';
import { getUpdatedData } from './helpers/httpRequester.js';
import { mapUpload, logoUpload } from './helpers/Uploads.js';
import seeder from './helpers/Seeder.js';
// Do not remove the import below, it bootstraps the preferences
// state
import CadState from './helpers/State.js';

// TODO: Investigate why we're leaking
process.setMaxListeners(0);

dotenv.config();

const Op = Sequelize.Op;

const { CLIENT_HOST, CLIENT_PORT, CV_MAX_ASSIGNED, CV_MAX_REGISTERED } =
    process.env;

// The Express server
const app = express();

// CORS support
app.use(cors());
// Make the request body available
app.use(bodyParser.json());
// Strip out any __typename properties from the body
app.use(stripTypename);
// Initialise Steam authentication
initAuth();
app.use(passport.initialize());

app.get(/^\/auth\/steam(\/return)?$/, (req, res, next) => {
    passport.authenticate('steam', (err, user, info) => {
        if (!user) {
            console.log(err, user, info);
            if (info && info.hasOwnProperty('message')) {
                if (info.message == 'max_users') {
                    res.redirect(
                        CLIENT_HOST + ':' + CLIENT_PORT + '/max_users'
                    );
                }
            } else {
                res.redirect(CLIENT_HOST + ':' + CLIENT_PORT + '/no_auth');
            }
        } else {
            res.redirect(
                CLIENT_HOST + ':' + CLIENT_PORT + '/uuid/' + user.uuid
            );
        }
    })(req, res, next);
});

// Handle map uploads
app.post('/maps/upload', mapUpload.single('map'), async (req, res, next) => {
    const { id, name } = req.body;
    // Check if we've already uploaded at least one file for
    // this map, we check using ID or name
    const exists = await resolvers.Query.getMap(
        null,
        { [Op.or]: [{ id }, { name }] },
        { Models }
    );
    if (!exists) {
        const map = await resolvers.Mutation.createMap(
            null,
            { id, name },
            { Models }
        );
        res.status(201).send(map);
    } else {
        res.status(204).send();
    }
});

// Handle logo uploads
app.post('/logos/upload', logoUpload.single('file'), async (req, res) => {
    const department = await resolvers.Query.getDepartment(
        null,
        { id: req.body.departmentId },
        { Models }
    );
    const { id, name, colour, readonly } = department;
    const updateObj = {
        id,
        name,
        colour,
        logo: req.file.filename,
        readonly
    };
    await resolvers.Mutation.updateDepartment(null, updateObj, { Models });
    res.status(201).send({ filename: req.file.filename });
});

// Create the Apollo server
// We also pass a 'subscriptions' object to the constructor to specify
// options for our subscriptions listener
const initApolloServer = async httpServer => {
    const apolloServer = new ApolloServer({
        subscriptions: {
            path: '/subscriptions',
            onConnect: () => console.log('>> Connected'),
            onDisconnect: () => console.log('<< Disconnected')
        },
        typeDefs,
        resolvers,
        // Here we are passing different context depending on whether we're
        // receiving a websocket connection or a regular HTTPS request
        context: async ({ req, connection }) => {
            const reqIp =
                req &&
                req.headers.hasOwnProperty('x-forwarded-for') &&
                req.headers['x-forwarded-for']
                    ? req.headers['x-forwarded-for']
                    : req
                    ? req.ip.replace(/^::ffff:/, '')
                    : null;
            // Does this request contain a header with a valid token
            // for a FiveM request
            const expectedFivemToken = CadState.getPreference('api_token');
            const fivemToken =
                req &&
                req.headers.hasOwnProperty('cadvanced-token') &&
                req.headers['cadvanced-token'];
            const hasFivemToken =
                expectedFivemToken &&
                expectedFivemToken.length > 0 &&
                fivemToken == expectedFivemToken;
            if (connection) {
                // WSS request, check connection for metadata
                return Promise.resolve({ Models });
            } else {
                // Regular HTTPS request
                // If the query is one of the following, we want to try and
                // grab the token and get the user from it
                const queryWhitelist = ['authenticateUser'];
                const queryWhitelisted = queryWhitelist.find(query =>
                    req.body.query.match(query)
                );
                if (queryWhitelisted) {
                    return Promise.resolve({
                        Models,
                        hasFivemToken,
                        instanceVars: {
                            CV_MAX_ASSIGNED,
                            CV_MAX_REGISTERED
                        }
                    });
                }

                // Check for a token, grab the user
                // and pass it in the context
                const token = req.headers.authorization || '';
                if (token.length > 0) {
                    return resolvers.Query.getUserFromToken(
                        null,
                        { token },
                        { Models }
                    )
                        .then(user => {
                            return user
                                ? Promise.resolve({
                                      user,
                                      Models,
                                      hasFivemToken,
                                      instanceVars: {
                                          CV_MAX_ASSIGNED,
                                          CV_MAX_REGISTERED
                                      }
                                  })
                                : Promise.resolve({
                                      Models,
                                      hasFivemToken,
                                      instanceVars: {
                                          CV_MAX_ASSIGNED,
                                          CV_MAX_REGISTERED
                                      }
                                  });
                        })
                        .catch(err => {
                            throw new AuthenticationError(err);
                        });
                }
                // We can't throw an AuthenticationError here because
                // some routes don't need tokens
                return Promise.resolve({
                    Models,
                    hasFivemToken,
                    instanceVars: {
                        CV_MAX_ASSIGNED,
                        CV_MAX_REGISTERED
                    }
                });
            }
        }
    });
    // Add the Apollo server as middleware to Express, specifying the /api path
    apolloServer.applyMiddleware({ app, path: '/api' });

    // Add subscription handling to the server
    apolloServer.installSubscriptionHandlers(httpServer);
    return apolloServer;
};

const startServer = async () => {
    await Models.sequelize.authenticate();
    await Models.sequelize.sync();
    await seeder.up();
    CadState.init();
    // Create an http server
    const httpServer = http.createServer(app);
    await initApolloServer(httpServer);
    httpServer.listen(8080, () => {
        console.log('🚀 API ready');
        console.log('🚀 Subscriptions ready');
    });
};

startServer();

// Retrieve all user locations from FiveM
setInterval(() => {
    const locations = getUpdatedData('locations');
    if (locations) {
        locations
            .then(res => {
                resolvers.Mutation.updateUserLocations(null, res.data, {
                    Models
                });
            })
            .catch(() => {
                // We do nothing at this stage
            });
    }
}, 5000);
