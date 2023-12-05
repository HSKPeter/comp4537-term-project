const { USER_MESSAGES } = require('../messages/userMessage');
const { API_ROUTE_PATHS } = require('../router/routes');
const { COOKIE_KEYS, COOKIE_CONFIG } = require('../utils/cookieUtils');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
const { getRoleFromToken, USER_ROLES } = require('../utils/userAuthenticationUtils');

const pathsExclusiveToAdmin = [
  API_ROUTE_PATHS.API_STATS,
  API_ROUTE_PATHS.API_STATS_BY_USER,
  API_ROUTE_PATHS.API_CONSUMPTION
];

function checkAdminRole(req, res, next) {
  if (!pathsExclusiveToAdmin.includes(req.path)) {
    next();
    return;
  }

  const token = req.cookies.token;

  if (!token) {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ error: USER_MESSAGES.auth.tokenNotFound });
    return;
  }

  getRoleFromToken(token)
    .then(({ role, token }) => {
      if (role !== USER_ROLES.ADMIN) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ error: USER_MESSAGES.auth.notAdmin });
        return;
      }

      res.cookie(COOKIE_KEYS.TOKEN, token, COOKIE_CONFIG);
      next();
    })
    .catch(() => {
      res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ error: USER_MESSAGES.auth.errorValidatingToken });
      return;
    });
}

module.exports = {
  checkAdminRole
};