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

        if (response.status === HTTP_STATUS_CODES.CREATED) {
            return true;
        }

        return false;
    } catch (err) {
        return false;
    }
}

async function loginUser({ username, password }) {
    const response = await axios.post(API_ENDPOINTS.LOGIN, { username, password });

    if (response.status === HTTP_STATUS_CODES.OK) {
        const { token } = response.data;
        return token;
    }

    const errorMessage = response.data.error ?? "";
    throw new Error(errorMessage);
}

async function getUserQuotaFromToken(token) {
    const response = await axios.post(API_ENDPOINTS.VALIDATE, { token });
    if (response.status === HTTP_STATUS_CODES.OK) {
        const { hasRemainingQuota } = response.data;
        return hasRemainingQuota ?? 0;
    }

    const { error } = response.data;
    if (error) {
        console.error(vsprintf(SERVER_MESSAGES.failedToGetQuotaFromToken, [error]));
        throw new Error(error);
    }

    return 0;
}

const getHash = (password) => {
    return "" + password + "_hash"
}

const getToken = () => {
    return "one_time_token"
}

module.exports = {
    registerUser,
    loginUser,
    getHash, // TODO: remove this
    getToken, // TODO: remove this
    getUserQuotaFromToken
}