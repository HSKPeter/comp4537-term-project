const { authAxiosInstance } = require('./httpUtils');
const { AUTH_SERVER_API_ENDPOINTS } = require('./httpUtils');
const { vsprintf } = require('sprintf-js');
const { SERVER_MESSAGES } = require('../messages/serverMessage');

async function recordUsageOfApi({ token, endpoint, method, timestamp }) {
    try {
        await authAxiosInstance.post(AUTH_SERVER_API_ENDPOINTS.RECORD, {
            token,
            endpoint,
            method,
            timestamp
        });
        console.log(vsprintf(SERVER_MESSAGES.recordedApiUsage.success, [method, endpoint]));
    } catch (err) {
        console.error(vsprintf(SERVER_MESSAGES.recordedApiUsage.error, [method, endpoint]));
    }
}

module.exports = {
    recordUsageOfApi
}