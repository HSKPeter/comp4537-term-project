const { vsprintf } = require("sprintf-js");
const { authAxiosInstance, AUTH_SERVER_API_ENDPOINTS, HTTP_STATUS_CODES } = require("../utils/httpUtils");
const { SERVER_MESSAGES } = require("../messages/serverMessage");
const { API_ROUTE_PATHS } = require("../router/routes");
const { USER_MESSAGES } = require("../messages/userMessage");

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
        console.log(vsprintf(SERVER_MESSAGES.recordedApiUsage.success, [method, endpoint]));
        next();
    })
    .catch(() => {
        console.log(vsprintf(SERVER_MESSAGES.recordedApiUsage.error, [method, endpoint]));
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.generalError });
    });
}

module.exports = {
    recordApiUsage
}