const { USER_MESSAGES } = require('../messages/userMessage');

// TODO: Remove this handler
function rootRouteHandler(req, res) {
    const message = USER_MESSAGES.test;
    res.json({ message });
}


const ROUTE_HANDLERS = {
    root: rootRouteHandler,
};

module.exports = {
    ROUTE_HANDLERS,
};