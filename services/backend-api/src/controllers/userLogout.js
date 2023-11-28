const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
const { COOKIE_KEYS } = require('../utils/cookieUtils');

function userLogoutController(_req, res) {
  res.clearCookie(COOKIE_KEYS.TOKEN);
  res.status(HTTP_STATUS_CODES.NO_CONTENT);
  res.end();
}

module.exports = {
  userLogoutController
}