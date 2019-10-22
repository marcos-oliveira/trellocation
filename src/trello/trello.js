const axios_ = require('axios');
// const getConfig from 'next/config';

const TRELLO_KEY = '7706592a605aa2c1f413b2461b01bd58';
const TRELLO_TOKEN = 'dc82fcae79825f496d417ac5dcea319f02d0567e887a8149b86f422569c55cff';
//const TRELLO_BOARD = process.env.TRELLO_BOARD;

const { CancelToken, isCancel } = axios_;

// const {
//     publicRuntimeConfig: { TRELLO_URL },
// } = getConfig();


// if (!process.env.TRELLO_URL) {
//     throw new Error('TRELLO_URL is not defined');
// }

// if (!TRELLO_URL) {
//     // eslint-disable-next-line no-console
//     console.log('warning: TRELLO_URL is not defined!');
// }

const axios = axios_.create({
    // baseURL: `${TRELLO_URL}`,
    baseURL: 'https://api.trello.com'
});

const apiUrl = (version) => (...endpoints) =>
    `/${version}/${endpoints.join('/')}?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

module.exports = {
    urlTrello: apiUrl('1'),

    get(endpoint, params, axiosConfig) {
        return axios.get(endpoint, { params, ...axiosConfig});
    },

    post(endpoint, params, axiosConfig) {
        return axios.post(endpoint, params, axiosConfig);
    },

    put(endpoint, params, axiosConfig) {
        return axios.put(endpoint, params, axiosConfig);
    },
};
