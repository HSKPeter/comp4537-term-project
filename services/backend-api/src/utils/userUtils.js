const axios = require('axios');
const { AUTH_SERVER_ORIGIN } = require('../config');
const { UserUnauthorizedException, AuthenticationServerException } = require('../exceptions');
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');

const API_ENDPOINTS = {
    REGISTER: `${AUTH_SERVER_ORIGIN}/register`,
    LOGIN: `${AUTH_SERVER_ORIGIN}/login`,
    VALIDATE: `${AUTH_SERVER_ORIGIN}/user`,
}

async function registerUser({ username, password }) {
    try {
        const response = await axios.post(API_ENDPOINTS.REGISTER, { username, password });

        if (response.status === HTTP_STATUS_CODES.CREATED) {
            return true;
        }

        return false;
    } catch (err) {
        console.error(vsprintf(SERVER_MESSAGES.failedToRegisterUser, [err?.stack ?? err]));
        return false;
    }
}

async function loginUser({ username, password }) {
    const response = await axios.post(API_ENDPOINTS.LOGIN, { username, password });

    if (response.status === HTTP_STATUS_CODES.OK) {
        const { token } = response.data;
        return token;
    } else if (response.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
        const { error } = response.data;
        throw new UserUnauthorizedException(error);
    } else {
        const { error } = response.data;
        throw new AuthenticationServerException(error);
    }
}

async function validateUser() {

}

module.exports = {
    registerUser,
    loginUser,
    validateUser,
}