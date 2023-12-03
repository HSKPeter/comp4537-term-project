const axios = require('axios');
const { AUTH_SERVER_ORIGIN, API_SERVER_ORIGIN } = require('../config'); // Assuming you have a config file with API_SERVER_ORIGIN
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES } = require('./httpUtils');


const API_ENDPOINTS = {
    STATS: "/api-stats",
    USER_STATS: "/users-info",
    CONSUMPTION: "/api-consumption",
}

const apiAxiosInstance = axios.create({
    baseURL: API_SERVER_ORIGIN
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
        console.error(`Failed to fetch API stats from User: ${error.message}`);
        throw error;
    }
}

async function getApiConsumption(token) {
  try {
      const response = await apiAxiosInstance.post(API_ENDPOINTS.CONSUMPTION, {}, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (response.status !== HTTP_STATUS_CODES.OK) {
          const errorMessage = response.data.error ?? SERVER_MESSAGES.callingApiServer.unknownError;
          throw new Error(errorMessage);
      }

      return response.data.usageStats;
  } catch (error) {
      console.error(`Failed to fetch API Consumption stats: ${error.message}`);
      throw error;
  }
}


// Add any additional admin-related functions as needed

module.exports = {
    getApiStats,
    getApiStatsFromUser,
    getApiConsumption
    // Add other admin-related functions here
}
