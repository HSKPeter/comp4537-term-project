const { authAxiosInstance } = require('./httpUtils');

async function getApiStats() {
    const result = await authAxiosInstance.get('/api-stats');
    return result.data.usageStats;
}

async function getApiStatsByUser() {
    const result = await authAxiosInstance.get('/users-info');
    return result.data.usageStats;
}

async function getApiConsumptionStats(userId) {
    const result = await authAxiosInstance.get(`/api-consumption/${userId}`);
    return result.data.usageStats;
}

module.exports = {
    getApiStats,
    getApiStatsByUser,
    getApiConsumptionStats,
};
