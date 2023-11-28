const { USER_MESSAGES } = require("../messages/userMessage");
const { HTTP_STATUS_CODES } = require("../utils/httpUtils");
const { registerUser } = require("../utils/userAuthenticationUtils");
const { COOKIE_KEYS, COOKIE_CONFIG } = require("../utils/cookieUtils");

function userRegistrationController(req, res) {
    try {
        const { email, password } = req.body;
        if (email === undefined || password === undefined) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.registration.missingEmailOrPassword });
            return;
        }
        
        const username = email; // TODO: Need to further discuss with the team

        registerUser({ username, password })
            .then(({ token, role }) => {
                res.cookie(COOKIE_KEYS.TOKEN, token, COOKIE_CONFIG);
                res.status(HTTP_STATUS_CODES.CREATED).json({ role });
            })
            .catch((_err) => {
                res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ error: USER_MESSAGES.registration.invalidCredentials });
            });
    } catch (err) {
        console.error(err);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.registration.failure });
    }
}

module.exports = {
    userRegistrationController
}