const axios = require('axios');
const { AUTH_SERVER_ORIGIN } = require('../config');
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES } = require('./httpUtils');

const USER_ROLES = {
    ADMIN: "admin",
    USER: "user"
}

const API_ENDPOINTS = {
    REGISTER: "/register",
    LOGIN: "/login",
    VALIDATE: "/user",
    ROLE: "/role"
}

const authAxiosInstance = axios.create({
    baseURL: AUTH_SERVER_ORIGIN
});

authAxiosInstance.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer abcd`;
    return config;
});

async function registerUser({ email, username, password }) {
    const response = await authAxiosInstance.post(API_ENDPOINTS.REGISTER, { email, username, password });

    if (response.status !== HTTP_STATUS_CODES.OK) {
        const errorMessage = response.data.error ?? SERVER_MESSAGES.callingAuthServer.unknownError;
        throw new Error(errorMessage);
    }

    const { token, role } = response.data;
    return { token, role };
}

async function loginUser({ email, username, password }) {
    const response = await authAxiosInstance.post(API_ENDPOINTS.LOGIN, { email, username, password });

    if (response.status !== HTTP_STATUS_CODES.OK) {
        const errorMessage = response.data.error ?? SERVER_MESSAGES.callingAuthServer.unknownError;
        throw new Error(errorMessage);
    }

    const { token, role } = response.data;
    return { token, role };
}

async function getUserQuotaFromToken(token) {
    // const response = await authAxiosInstance.post(API_ENDPOINTS.VALIDATE, { token });
    // if (response.status !== HTTP_STATUS_CODES.OK) {
    //     const errorMessage = response.data.error ?? SERVER_MESSAGES.callingAuthServer.unknownError;
    //     throw new Error(errorMessage);
    // }

    // const { hasRemainingQuota } = response.data;
    // return hasRemainingQuota ?? 0;
    return 99;
}

async function getRoleFromToken(token) {
    const response = await authAxiosInstance.post(API_ENDPOINTS.ROLE, { token });
    if (response.status !== HTTP_STATUS_CODES.OK) {
        const errorMessage = response.data.error ?? SERVER_MESSAGES.callingAuthServer.unknownError;
        throw new Error(errorMessage);
    }
    const { role } = response.data;
    return role;
}

module.exports = {
    registerUser,
    loginUser,
    getUserQuotaFromToken,
    getRoleFromToken,
    USER_ROLES
}