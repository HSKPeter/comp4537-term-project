const { USER_MESSAGES } = require('../messages/userMessage');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');

// TODO: Remove this sample handler
function sampleGetRouteHandler(req, res) {
    try {
        const message = USER_MESSAGES.test;
        res.json({ message });
    } catch (error) {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.generalError });
    }
}

// TODO: Remove this sample handler
function samplePostRouteHandler(req, res) {
    try {
        const message = USER_MESSAGES.test;
        res.json({ message });
    } catch (error) {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.generalError });
    }

}

const ROUTE_HANDLERS = {
    root: sampleGetRouteHandler,
    summarize: samplePostRouteHandler,
};

module.exports = {
    ROUTE_HANDLERS,
};