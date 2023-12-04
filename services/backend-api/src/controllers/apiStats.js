const { vsprintf } = require("sprintf-js");
const { SERVER_MESSAGES } = require("../messages/serverMessage"); // Assuming you have a server messages module
const { HTTP_STATUS_CODES } = require("../utils/httpUtils");
const { readRole } = require("../utils/tokenUtils"); // Assuming you have a function to get user token
const { getApiStats, getApiStatsByUser, getApiConsumptionStats } = require("../utils/adminUtils");

async function apiStatsController(req, res) {
    try {

        const token = req.cookies.token;
        const role = await readRole(token);
        console.log(role);

        if (role !== 'admin') { // Assuming 'admin' is the required role
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

        const token = req.cookies.token;
        const role = await readRole(token);
        console.log(role);

        if (role !== 'admin') { // Assuming 'admin' is the required role
            res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ error: SERVER_MESSAGES.accessDenied });
            return;
        }

        // Fetch API stats by user
        const apiStatsByUser = await getApiStatsByUser();

        // Return API stats by user
        res.status(HTTP_STATUS_CODES.OK).json({ usageStats: apiStatsByUser });

    } catch (err) {
        console.error(vsprintf(SERVER_MESSAGES.failedToGetApiStats, [err?.stack ?? err]));
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: SERVER_MESSAGES.unknownError });
    }
}

async function apiConsumptionController(req, res) {
    try {
        const token = req.cookies.token;
        const userId = readUserId(token);

        // Fetch API consumption stats for the specified user ID
        const apiConsumptionStats = await getApiConsumptionStats(userId);

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
