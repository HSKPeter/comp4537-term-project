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

const STANDARD_HEADERS = {
    ACCESS_CONTROL_EXPOSE_HEADERS: 'Access-Control-Expose-Headers',
};

const CUSTOM_HEADERS = {
    API_LIMIT_EXCEEDED: 'X-API-Limit-Exceeded'
};

const authAxiosInstance = axios.create({
    baseURL: AUTH_SERVER_ORIGIN
});

authAxiosInstance.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${AUTH_SERVER_API_KEY}`;
    return config;
});

const AUTH_SERVER_API_ENDPOINTS = {
    REGISTER: "/register",
    LOGIN: "/login",
    VALIDATE: "/user",
    ROLE: "/role",
    RECORD: "/record",
    BOOKMARK_WORDS: "/bookmark-words",
}

module.exports = {
    HTTP_STATUS_CODES,
    STANDARD_HEADERS,
    CUSTOM_HEADERS,
    AUTH_SERVER_API_ENDPOINTS,
    authAxiosInstance
};