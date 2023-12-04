const { USER_MESSAGES } = require("../messages/userMessage");
const { HTTP_STATUS_CODES } = require("../utils/httpUtils");
const { registerUser } = require("../utils/userAuthenticationUtils");
const { COOKIE_KEYS, COOKIE_CONFIG } = require("../utils/cookieUtils");
const { recordUsageOfApi } = require("../utils/recordApiUsageUtils");

function userRegistrationController(req, res) {
    try {
        const timestamp = Date.now();
        const { email, username, password } = req.body;
        if (email === undefined || password === undefined || username === undefined) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.registration.missingFields });
            return;
        }

        registerUser({ email, username, password })
            .then(({ token, role }) => {
                recordUsageOfApi({ token, endpoint: req.path, method: req.method, timestamp });
                res.cookie(COOKIE_KEYS.TOKEN, token, COOKIE_CONFIG);
                res.status(HTTP_STATUS_CODES.CREATED).json({ role });
            })
            .catch(() => {
                res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ error: USER_MESSAGES.registration.failure });
            });
    } catch (err) {
        console.error(err);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.registration.failure });
    }
}

module.exports = {
    userRegistrationController
}