const jwt = require('jsonwebtoken');
const { AUTH_SERVER_ORIGIN } = require('../config');
const { SERVER_MESSAGES } = require('../messages/serverMessage');

async function getRoleFromToken(token) {
    const response = await axios.post(AUTH_SERVER_ORIGIN + '/role', { token });
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