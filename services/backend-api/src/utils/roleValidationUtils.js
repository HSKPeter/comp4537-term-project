const axios = require('axios');
const { AUTH_SERVER_ORIGIN } = require('../config');
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES } = require('./httpUtils');

async function getRoleFromToken(token) {
    const apiEndpoint = AUTH_SERVER_ORIGIN + '/role';
    const response = await axios.post(apiEndpoint, { token });
    if (response.status !== HTTP_STATUS_CODES.OK) {
        const errorMessage = response.data.error ?? SERVER_MESSAGES.callingAuthServer.unknownError;
        throw new Error(errorMessage);
    }
    const { role } = response.data;
    return role;
}

module.exports = {
    getRoleFromToken
}