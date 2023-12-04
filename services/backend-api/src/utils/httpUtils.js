const axios = require('axios');
const { AUTH_SERVER_ORIGIN, AUTH_SERVER_API_KEY } = require('../config');

const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

const authAxiosInstance = axios.create({
    baseURL: AUTH_SERVER_ORIGIN
});

authAxiosInstance.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${AUTH_SERVER_API_KEY}`;
    return config;
});

module.exports = {
    HTTP_STATUS_CODES,
    authAxiosInstance
};