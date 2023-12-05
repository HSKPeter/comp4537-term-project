const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES, AUTH_SERVER_API_ENDPOINTS, authAxiosInstance } = require('./httpUtils');

const USER_ROLES = {
    ADMIN: "Admin",
    USER: "Regular"
}

async function registerUser({ email, username, password }) {
    const response = await authAxiosInstance.post(AUTH_SERVER_API_ENDPOINTS.REGISTER, { email, username, password });

    if (response.status !== HTTP_STATUS_CODES.CREATED) {
        const errorMessage = response.data.error ?? SERVER_MESSAGES.callingAuthServer.unknownError;
        throw new Error(errorMessage);
    }

    const { token, role } = response.data;
    return { token, role };
}

async function loginUser({ email, username, password }) {
    const response = await authAxiosInstance.post(AUTH_SERVER_API_ENDPOINTS.LOGIN, { email, username, password });

    if (response.status !== HTTP_STATUS_CODES.OK) {
        const errorMessage = response.data.error ?? SERVER_MESSAGES.callingAuthServer.unknownError;
        throw new Error(errorMessage);
    }

    const { token, role } = response.data;
    return { token, role };
}

async function getUserQuotaFromToken(token) {
    const response = await authAxiosInstance.post(AUTH_SERVER_API_ENDPOINTS.VALIDATE, { token });
    if (response.status !== HTTP_STATUS_CODES.OK) {
        const errorMessage = response.data.error ?? SERVER_MESSAGES.callingAuthServer.unknownError;
        throw new Error(errorMessage);
    }

    const { hasRemainingQuota, newToken } = response.data;

    return {
        hasRemainingQuota: hasRemainingQuota ?? 0,
        token: newToken ?? token
    };
}

async function getRoleFromToken(token) {
    const response = await authAxiosInstance.post(AUTH_SERVER_API_ENDPOINTS.ROLE, { token });
    if (response.status !== HTTP_STATUS_CODES.OK) {
        const errorMessage = response.data.error ?? SERVER_MESSAGES.callingAuthServer.unknownError;
        throw new Error(errorMessage);
    }
    const { role, newToken } = response.data;
    return {
        role,
        token: newToken ?? token
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserQuotaFromToken,
    getRoleFromToken,
    USER_ROLES
}