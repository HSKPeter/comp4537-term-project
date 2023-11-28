const axios = require('axios');
const { AUTH_SERVER_ORIGIN } = require('../config');
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES } = require('./httpUtils');

const API_ENDPOINTS = {
    REGISTER: `${AUTH_SERVER_ORIGIN}/register`,
    LOGIN: `${AUTH_SERVER_ORIGIN}/login`,
    VALIDATE: `${AUTH_SERVER_ORIGIN}/user`,
}

async function registerUser({ username, password }) {
    try {
        const response = await axios.post(API_ENDPOINTS.REGISTER, { username, password });
        return response.status === HTTP_STATUS_CODES.CREATED;
    } catch (err) {
        return false;
    }
}

async function loginUser({ username, password }) {
    const response = await axios.post(API_ENDPOINTS.LOGIN, { username, password });

    if (response.status !== HTTP_STATUS_CODES.OK) {
        const errorMessage = response.data.error ?? SERVER_MESSAGES.callingAuthServer.unknownError;
        throw new Error(errorMessage);
    }

    const { token } = response.data;
    return token;
}

async function getUserQuotaFromToken(token) {
    const response = await axios.post(API_ENDPOINTS.VALIDATE, { token });
    if (response.status !== HTTP_STATUS_CODES.OK) {
        const errorMessage = response.data.error ?? SERVER_MESSAGES.callingAuthServer.unknownError;
        throw new Error(errorMessage);
    }

    const { hasRemainingQuota } = response.data;
    return hasRemainingQuota ?? 0;
}

module.exports = {
    registerUser,
    loginUser,
    getUserQuotaFromToken
}