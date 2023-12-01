const { vsprintf } = require('sprintf-js');
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
const { COOKIE_CONFIG, COOKIE_KEYS } = require('../utils/cookieUtils');
const { loginUser } = require('../utils/userAuthenticationUtils');
const { getApiStats } = require('../utils/adminUtils'); // Import the adminUtils

async function apiStatsController(req, res) {
    try {
        // Assuming you have a function to retrieve the JWT token from the request
        const userToken = getUserToken(req);

        // Validate the user's role (assuming 'admin' is required)
        const userRole = await getRoleFromToken(userToken);
        if (userRole !== USER_ROLES.ADMIN) {
            res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ error: SERVER_MESSAGES.accessDenied });
            return;
        }

        // Fetch API stats
        const apiStats = await getApiStats();

        // Return API stats
        res.status(HTTP_STATUS_CODES.OK).json({ usageStats: apiStats });

    } catch (err) {
        console.error(vsprintf(SERVER_MESSAGES.failedToGetApiStats, [err?.stack ?? err]))
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: SERVER_MESSAGES.unknownError });
    }
}

module.exports = {
    apiStatsController
}
