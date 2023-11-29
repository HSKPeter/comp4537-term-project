const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
const { USER_MESSAGES } = require('../messages/userMessage');
const { getRoleFromToken } = require('../utils/userAuthenticationUtils');
const { COOKIE_KEYS, COOKIE_CONFIG } = require('../utils/cookieUtils');

function roleValidationController(req, res) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.role.roleNotFound });
        }

        getRoleFromToken(token)
            .then(({ role, token }) => {
                res.cookie(COOKIE_KEYS.TOKEN, token, COOKIE_CONFIG);
                res.status(HTTP_STATUS_CODES.OK).json({ role });
            })
            .catch(() => {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.role.roleNotFound });
            });

    } catch (err) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.role.roleNotFound });
    }
}

module.exports = {
    roleValidationController
}