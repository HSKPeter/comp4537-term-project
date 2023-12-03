const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
const { COOKIE_KEYS, COOKIE_CONFIG } = require('../utils/cookieUtils');

function userLogoutController(_req, res) {
  res.clearCookie(COOKIE_KEYS.TOKEN, COOKIE_CONFIG);
  res.status(HTTP_STATUS_CODES.NO_CONTENT);
  res.end();
}

module.exports = {
  userLogoutController
}