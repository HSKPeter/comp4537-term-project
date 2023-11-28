const { WHITE_LIST_ORIGINS } = require('../config');

const CORS_OPTIONS = {
    credentials: true,
    origin: function (origin, callback) {
        if (WHITE_LIST_ORIGINS.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

module.exports = {
    CORS_OPTIONS,
};