const { WHITE_LIST_ORIGINS } = require('../config');
const { SERVER_MESSAGES } = require('../messages/serverMessage');

const CORS_OPTIONS = {
    credentials: true,
    origin: function (origin, callback) {
        if (WHITE_LIST_ORIGINS.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error(SERVER_MESSAGES.corsNotAllowed))
        }
    }
}

module.exports = {
    CORS_OPTIONS,
};