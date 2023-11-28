const jwt = require('jsonwebtoken');
const { USER_MESSAGES } = require('../messages/userMessage');

function roleValidationController(req, res) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.role.roleNotFound });
        }

        const payload = jwt.decode(token);
        if (!payload) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.role.roleNotFound });
            return;
        }

        const { role } = payload;
        if (role === undefined) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.role.roleNotFound });
            return;
        }

        res.json({ role });
    } catch (err) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.role.roleNotFound });
    }
}

module.exports = {
    roleValidationController
}