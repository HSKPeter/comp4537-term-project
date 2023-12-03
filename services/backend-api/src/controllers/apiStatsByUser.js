const { vsprintf } = require('sprintf-js');
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
const { getUserToken, getRoleFromToken, USER_ROLES } = require('../utils/tokenUtils');
const { runSQLQuery } = require('../utils/databaseUtils');
const { getApiStatsFromUser } = require('../utils/adminUtils');

async function apiStatsByUserController(req, res) {
    try {
        // Assuming you have a function to retrieve the JWT token from the request
        const userToken = getUserToken(req);

        // Validate the user's role (assuming 'admin' is required)
        const userRole = await getRoleFromToken(userToken);
        if (userRole !== USER_ROLES.ADMIN) {
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

module.exports = {
    apiStatsByUserController
};
