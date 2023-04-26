import net from 'net';

import Models from '../db/Models/index.js';
import CadState from '../helpers/State.js';

export const getCharacter = user => {
    if (!user) return null;
    // Look in both citizens and officers for an active character
    return Models.Citizen.findOne({
        where: { UserId: user.id, active: true }
    }).then(cit => {
        if (cit) {
            return cit;
        } else {
            return Models.Officer.findOne({
                where: { UserId: user.id, active: true }
            }).then(off => {
                if (off) {
                    return off;
                } else {
                    return null;
                }
            });
        }
    });
};

export const hasFiveM = () => {
    const prefs = CadState.getPreferences();
    return !prefs ||
        !prefs.fivem_server_ip ||
        !prefs.fivem_server_ip.value ||
        prefs.fivem_server_ip.value.length === 0 ||
        !prefs.fivem_server_port ||
        !prefs.fivem_server_port.value ||
        prefs.fivem_server_port.value.length === 0
        ? false
        : true;
};

// Check the connection to the FiveM server using the currently defined IP & port
export const checkConnection = async ({ Models }) => {
    const ip = await Models.Preference.findOne({
        where: { key: 'fivem_server_ip' }
    });
    const port = await Models.Preference.findOne({
        where: { key: 'fivem_server_port' }
    });
    if (ip.length === 0 || port.length === 0) {
        return new Promise.reject('FiveM IP or port missing');
    }
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject({ message: 'timeout' });
            socket.end();
        }, 3000);
        const socket = net.createConnection(port.value, ip.value, () => {
            clearTimeout(timer);
            socket.end();
            resolve({ message: 'OK' });
        });
        socket.on('error', function (err) {
            clearTimeout(timer);
            reject(err);
        });
    });
};
