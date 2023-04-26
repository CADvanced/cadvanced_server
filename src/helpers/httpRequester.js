import axios from 'axios';

import CadState from '../helpers/State.js';

export const makeUpdateRequest = payload => {
    const prefs = CadState.getPreferences();
    if (!prefs.fivem_server_ip) return;
    return axios
        .post(
            `http://${prefs.fivem_server_ip.value}:${prefs.fivem_server_port.value}/cadvanced_mdt/update`,
            payload,
            { timeout: 5000 }
        )
        .then(() => true)
        .catch(error => console.log(error));
};

export const getUpdatedData = type => {
    const prefs = CadState.getPreferences();
    if (!prefs.fivem_server_ip) return;
    return axios
        .get(
            `http://${prefs.fivem_server_ip.value}:${prefs.fivem_server_port.value}/cadvanced_mdt/${type}`,
            { timeout: 5000 }
        )
        .then(result => result)
        .catch(error => console.log(error));
};

export const sendMessage = payload => {
    const prefs = CadState.getPreferences();
    if (!prefs.fivem_server_ip) return;
    return axios
        .post(
            `http://${prefs.fivem_server_ip.value}:${prefs.fivem_server_port.value}/cadvanced/message`,
            payload,
            { timeout: 5000 }
        )
        .then(result => result)
        .catch(error => console.log(error));
};

export const fivemLatestRelease = () => {
    return axios
        .get(
            'https://api.github.com/repos/CADvanced/cadvanced_mdt/releases/latest',
            { timeout: 10000 }
        )
        .then(result => true)
        .catch(error => console.log(error));
};

export const fivemResourceVersion = () => {
    const prefs = CadState.getPreferences();
    if (!prefs.fivem_server_ip) return;
    return axios
        .get(
            `http://${prefs.fivem_server_ip.value}:${prefs.fivem_server_port.value}/cadvanced_mdt/version`,
            { timeout: 10000 }
        )
        .then(result => true)
        .catch(error => console.log(error));
};
