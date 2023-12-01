const axios = require('axios');
const { AUTH_SERVER_ORIGIN, API_SERVER_ORIGIN } = require('../config'); // Assuming you have a config file with API_SERVER_ORIGIN
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES } = require('./httpUtils');

const API_ENDPOINTS = {
    STATS: "/api-stats",
    USER_STATS: "/users-info"
}

const apiAxiosInstance = axios.create({
    baseURL: API_SERVER_ORIGIN
});

apiAxiosInstance.interceptors.request.use((config) => {
    // Assuming you have a function to retrieve the JWT token for the admin user
    const adminToken = getAdminToken(); 
    config.headers['Authorization'] = `Bearer ${adminToken}`;
    return config;
});

async function getApiStats() {
    try {
        const response = await apiAxiosInstance.get(API_ENDPOINTS.STATS);

        if (response.status !== HTTP_STATUS_CODES.OK) {
            const errorMessage = response.data.error ?? SERVER_MESSAGES.callingApiServer.unknownError;
            throw new Error(errorMessage);
        }

        return response.data.usageStats;
    } catch (error) {
        console.error(`Failed to fetch API stats: ${error.message}`);
        throw error;
    }
}

async function getApiStatsFromUser() {
    try {
        const response = await apiAxiosInstance.get(API_ENDPOINTS.USER_STATS);

        if (response.status !== HTTP_STATUS_CODES.OK) {
            const errorMessage = response.data.error ?? SERVER_MESSAGES.callingApiServer.unknownError;
            throw new Error(errorMessage);
        }

        return response.data.usageStats;
    } catch (error) {
        console.error(`Failed to fetch API stats: ${error.message}`);
        throw error;
    }
}

// Add any additional admin-related functions as needed

module.exports = {
    getApiStats,
    getApiStatsFromUser
    // Add other admin-related functions here
}
