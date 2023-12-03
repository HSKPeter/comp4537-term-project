const { vsprintf } = require("sprintf-js");
const { SERVER_MESSAGES } = require("../messages/serverMessage"); // Assuming you have a server messages module
const { HTTP_STATUS_CODES } = require("../utils/httpUtils");
const { getRoleFromToken } = require("../utils/tokenUtils"); // Assuming you have a function to get role from token
const { getUserToken } = require("../utils/tokenUtils"); // Assuming you have a function to get user token
const { getApiStats, getApiStatsFromUser, getApiConsumptionForCurrentUser } = require("../utils/adminUtils");

async function apiStatsController(req, res) {
    try {
        // Assuming you have a function to retrieve the JWT token from the request
        const userToken = getUserToken(req);

        // Validate the user's role (assuming 'admin' is required)
        const userRole = await getRoleFromToken(userToken);
        if (userRole !== 'admin') { // Assuming 'admin' is the required role
            res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ error: SERVER_MESSAGES.accessDenied });
            return;
        }

        // Fetch API stats
        const apiStats = await getApiStats();

        // Return API stats
        res.status(HTTP_STATUS_CODES.OK).json({ usageStats: apiStats });

    } catch (err) {
        console.error(vsprintf(SERVER_MESSAGES.failedToGetApiStats, [err?.stack ?? err]));
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: SERVER_MESSAGES.unknownError });
    }
}

async function apiStatsByUserController(req, res) {
    try {
        // Assuming you have a function to retrieve the JWT token from the request
        const userToken = getUserToken(req);

        // Validate the user's role (assuming 'admin' is required)
        const userRole = await getRoleFromToken(userToken);
        if (userRole !== 'admin') { // Assuming 'admin' is the required role
            res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ error: SERVER_MESSAGES.accessDenied });
            return;
        }

        // Fetch API stats by user
        const apiStatsByUser = await getApiStatsFromUser();

        // Return API stats by user
        res.status(HTTP_STATUS_CODES.OK).json({ usageStats: apiStatsByUser });

    } catch (err) {
        console.error(vsprintf(SERVER_MESSAGES.failedToGetApiStats, [err?.stack ?? err]));
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: SERVER_MESSAGES.unknownError });
    }
}

async function apiConsumptionController(req, res) {
    try {
        // Assuming you have a function to retrieve the token from the request
        const token = getUserToken(req);

        // Extract userID from the request parameters
        const userId = readUserId(token); // Assuming you have a function to read user ID from token

        // Fetch API consumption stats for the specified user ID
        const apiConsumptionStats = await getApiConsumptionForCurrentUser(userId);

        // Return API consumption stats
        res.status(HTTP_STATUS_CODES.OK).json({ usageStats: apiConsumptionStats });

    } catch (err) {
        console.error(vsprintf(SERVER_MESSAGES.failedToGetApiConsumptionStats, [err?.stack ?? err]));
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: SERVER_MESSAGES.unknownError });
    }
}

module.exports = {
    apiStatsController,
    apiStatsByUserController,
    apiConsumptionController
};
