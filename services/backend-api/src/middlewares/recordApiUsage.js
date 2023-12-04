const { API_ROUTE_PATHS } = require("../router/routes");
const { recordUsageOfApi } = require("../utils/recordApiUsageUtils");

const pathsRequiringRecordingOfApiUsage = [
    API_ROUTE_PATHS.LOGIN,
    API_ROUTE_PATHS.REGISTER,
    API_ROUTE_PATHS.LOGOUT,
    API_ROUTE_PATHS.SEARCH_NEWS,
    API_ROUTE_PATHS.TRENDING_NEWS,
    API_ROUTE_PATHS.SUMMARIZE_TEXT,
    API_ROUTE_PATHS.BOOKMARK_WORDS
];

function recordApiUsage(req, res, next) {
    if (!pathsRequiringRecordingOfApiUsage.includes(req.path)) {
        next();
        return;
    }

    if (req.path === API_ROUTE_PATHS.LOGIN || req.path === API_ROUTE_PATHS.REGISTER) {
        next();  // Record API usage only after the user has been authenticated for login or registration
        return;
    }

    const token = req.cookies.token;
    const endpoint = API_ROUTE_PATHS.ROOT + req.path;
    const method = req.method;
    const timestamp = Date.now();
    recordUsageOfApi({ token, endpoint, method, timestamp })
    .then(() => {
        next();
    });
}

module.exports = {
    recordApiUsage
}