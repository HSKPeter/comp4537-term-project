const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
const { USER_MESSAGES } = require('../messages/userMessage');
const { getRoleFromToken } = require('../utils/roleValidationUtils');

function roleValidationController(req, res) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.role.roleNotFound });
        }

        getRoleFromToken(token)
            .then((role) => {
                res.status(HTTP_STATUS_CODES.OK).json({ role });
            })
            .catch((_err) => {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.role.roleNotFound });
            });

    } catch (err) {
        console.error(err);
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.role.roleNotFound });
    }
}

module.exports = {
    roleValidationController
}