import passport from 'passport';
import SteamStrategy from 'passport-steam';
import uuidv4 from 'uuid/v4.js';
import converter from 'hex2dec';

import Models from '../db/Models/index.js';
import CadState from '../helpers/State.js';

const { STEAM_HOST, STEAM_PORT, CV_MAX_REGISTERED, STEAM_API_KEY } =
    process.env;

export default function init() {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });

    passport.use(
        new SteamStrategy(
            {
                returnURL: `${STEAM_HOST}:${STEAM_PORT}/auth/steam/return`,
                realm: `${STEAM_HOST}:${STEAM_PORT}/`,
                apiKey: STEAM_API_KEY
            },
            (identifier, profile, done) => {
                const uid = uuidv4();
                // We only work in the hex version of the Steam ID
                const steamId = converter
                    .decToHex(profile.id)
                    .replace(/^0x/, '');
                // First check if we already know about this user
                return Models.User.findOne({
                    include: [
                        {
                            model: Models.UserType,
                            as: 'roles'
                        }
                    ],
                    where: { steamId }
                }).then(user => {
                    if (user) {
                        return user
                            .update({
                                uuid: uid,
                                userName: profile.displayName,
                                avatarUrl: profile.photos[0].value
                            })
                            .then(user => done(null, user));
                    } else {
                        // It's a new user, so let's check if we've reached
                        // our user limit
                        return Models.User.count().then(userCount =>
                            userCount >= CV_MAX_REGISTERED
                                ? done(null, false, {
                                      message: 'max_users'
                                  })
                                : createUser(steamId, profile, uid, done)
                        );
                    }
                });
            }
        )
    );
}

function createUser(steamId, profile, uid, done) {
    return Models.User.create(
        {
            steamId,
            userName: profile.displayName,
            avatarUrl: profile.photos[0].value,
            uuid: uid
        },
        {
            where: { steamId },
            returning: ['*']
        }
    ).then(newUser =>
        // Find out if this is the first user
        Models.User.count().then(userCount => {
            let rolesToGrant = {};
            if (userCount === 1) {
                // They need all roles, so get them
                rolesToGrant = Models.UserType.findAll();
                return rolesToGrant.then(userTypes =>
                    newUser.setRoles(userTypes.map(type => type.id)).then(() =>
                        Models.User.findOne({
                            include: [
                                {
                                    model: Models.UserType,
                                    as: 'roles'
                                }
                            ],
                            where: {
                                id: newUser.id
                            }
                        }).then(fullUser => done(null, fullUser))
                    )
                );
            } else {
                // It's a new user, we may need to grant them roles
                const confVal = CadState.getPreference(
                    'default_roles',
                    'value'
                );
                const defaultRoles = JSON.parse(confVal);
                if (defaultRoles.length > 0) {
                    newUser.setRoles(defaultRoles).then(() =>
                        Models.User.findOne({
                            include: [
                                {
                                    model: Models.UserType,
                                    as: 'roles'
                                }
                            ],
                            where: {
                                id: newUser.id
                            }
                        }).then(fullUser => done(null, fullUser))
                    );
                } else {
                    done(null, newUser);
                }
            }
        })
    );
}
