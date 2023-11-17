// TODO: Remove all sample controllers
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');

function sampleGetController(req, res) {
    try {
        const message = USER_MESSAGES.test;
        res.json({ message });
    } catch (error) {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.generalError });
    }
}


function samplePostController(req, res) {
    try {
        const payload = req.body;
        res.json({ payload });
    } catch (error) {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.generalError });
    }
}

module.exports = {
    sampleGetController,
    samplePostController
};