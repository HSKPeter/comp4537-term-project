const { vsprintf } = require("sprintf-js");
const { authAxiosInstance, AUTH_SERVER_API_ENDPOINTS } = require("../utils/httpUtils");
const { SERVER_MESSAGES } = require("../messages/serverMessage");
const { API_ROUTE_PATHS } = require("../router/routes");

function recordApiUsage(req, res, next) {
    const token = req.cookies.token;
    const endpoint = API_ROUTE_PATHS.ROOT + req.path;
    const method = req.method;
    const timestamp = Date.now();
    authAxiosInstance.post(AUTH_SERVER_API_ENDPOINTS.RECORD, {
        token,
        endpoint,
        method,
        timestamp
    })
    .then(() => {
        console.log(vsprintf(SERVER_MESSAGES.recordedApiUsage, [method, endpoint]));
        next();
    })
    .catch(() => {
        res.status(500).json({ error: 'Error recording API usage' });
    });
}

module.exports = {
    recordApiUsage
}