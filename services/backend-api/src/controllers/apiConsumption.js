const { vsprintf } = require('sprintf-js');
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
const { getUserToken } = require('../utils/tokenUtils');
const { getApiConsumptionStats } = require('../utils/adminUtils'); // Assuming you have a function to fetch API consumption stats

async function apiConsumptionController(req, res) {
    try {
        // Assuming you have a function to retrieve the JWT token from the request
        const userToken = getUserToken(req);

        // Fetch API consumption stats
        const apiConsumptionStats = await getApiConsumptionStats(userToken);

        // Return API consumption stats
        res.status(HTTP_STATUS_CODES.OK).json({ usageStats: apiConsumptionStats });

    } catch (err) {
        console.error(vsprintf(SERVER_MESSAGES.failedToGetApiConsumptionStats, [err?.stack ?? err]));
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: SERVER_MESSAGES.unknownError });
    }
}

module.exports = {
    apiConsumptionController
};
