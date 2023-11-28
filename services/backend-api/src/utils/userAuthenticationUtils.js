const axios = require('axios');
const { AUTH_SERVER_ORIGIN } = require('../config');
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES } = require('./httpUtils');

// TODO: Remove this when the auth server is ready
const jwt = require('jsonwebtoken');
const secret = "abcd1234";


const API_ENDPOINTS = {
    REGISTER: `${AUTH_SERVER_ORIGIN}/register`,
    LOGIN: `${AUTH_SERVER_ORIGIN}/login`,
    VALIDATE: `${AUTH_SERVER_ORIGIN}/user`,
}

async function registerUser({ username, password }) {
    const response = await axios.post(API_ENDPOINTS.REGISTER, { username, password });
    // TODO
    const role = "user";
    const token = jwt.sign({ role, username }, secret);
    return { token, role };
}

async function loginUser({ username, password }) {
    const response = await axios.post(API_ENDPOINTS.LOGIN, { username, password });

    if (response.status !== HTTP_STATUS_CODES.OK) {
        const errorMessage = response.data.error ?? SERVER_MESSAGES.callingAuthServer.unknownError;
        throw new Error(errorMessage);
    }

    const { token } = response.data;
    const role = 'user'; // TODO: Get the role from the auth server
    return { token, role };
}

async function getUserQuotaFromToken(token) {
    // const response = await axios.post(API_ENDPOINTS.VALIDATE, { token });
    // if (response.status !== HTTP_STATUS_CODES.OK) {
    //     const errorMessage = response.data.error ?? SERVER_MESSAGES.callingAuthServer.unknownError;
    //     throw new Error(errorMessage);
    // }

    // const { hasRemainingQuota } = response.data;
    // return hasRemainingQuota ?? 0;
    return 99;
}

module.exports = {
    registerUser,
    loginUser,
    getUserQuotaFromToken
}