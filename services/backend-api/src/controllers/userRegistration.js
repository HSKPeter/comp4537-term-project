const { USER_MESSAGES } = require("../messages/userMessage");
const { HTTP_STATUS_CODES } = require("../utils/httpUtils");
const { registerUser } = require("../utils/userAuthenticationUtils")

function userRegistrationController(req, res) {
    try {
        const { email, password } = req.body;
        if (email === undefined || password === undefined) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.registration.missingEmailOrPassword });
            return;
        }

        registerUser({ email, password })
            .then((hasRegisteredUser) => {
                if (hasRegisteredUser) {
                    res.status(HTTP_STATUS_CODES.CREATED).json({ message: USER_MESSAGES.registration.success });
                } else {
                    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.registration.failure });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.registration.failure });
            });
    } catch (err) {
        console.error(err);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.registration.failure });
    }
}

module.exports = {
    userRegistrationController
}