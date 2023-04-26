import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';

import Models from '../db/Models/index.js';
const { JWT_SECRET } = process.env;

// How long a token lasts, in seconds
// Currently set to 4 weeks
const tokenLifetime = 2419200;

export const userHasRoles = (requiredRoles, user) => {
    if (!requiredRoles || !user) {
        return false;
    }
    if (requiredRoles.length > 0 && user && user.hasOwnProperty('roles')) {
        const intersection = requiredRoles.filter(role => {
            return user.roles.find(uRole => uRole.code === role) ? true : false;
        });
        return intersection.length > 0;
    } else {
        throw new AuthenticationError('Required role missing');
    }
};

export const userHasCitizen = (citizenId, user) => {
    return Models.Citizen.findOne({
        where: { UserId: user.id, id: citizenId }
    });
};

export const createToken = userData => {
    const now = Date.now() / 1000;
    const expiry = now + tokenLifetime;
    const payload = {
        id: userData.id,
        uuid: userData.uuid,
        exp: expiry,
        iat: now
    };
    return jwt.sign(payload, JWT_SECRET);
};

export const checkToken = token => {
    const verifyMe = token.replace(/^Bearer /, '');
    return jwt.verify(verifyMe, JWT_SECRET, function (err, decoded) {
        return err ? Promise.reject(err) : Promise.resolve(decoded);
    });
};
