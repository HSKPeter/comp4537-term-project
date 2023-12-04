const { USER_MESSAGES } = require('../messages/userMessage');
const { API_ROUTE_PATHS } = require('../router/routes');
const { HTTP_STATUS_CODES, CUSTOM_HEADERS, STANDARD_HEADERS } = require('../utils/httpUtils');
const { COOKIE_KEYS, COOKIE_CONFIG } = require('../utils/cookieUtils');
const { getUserQuotaFromToken } = require('../utils/userAuthenticationUtils');

const pathsRequiringUserQuota = [
  API_ROUTE_PATHS.SEARCH_NEWS,
  API_ROUTE_PATHS.TRENDING_NEWS,
  API_ROUTE_PATHS.SUMMARIZE_TEXT,
  API_ROUTE_PATHS.BOOKMARK_WORDS,
  API_ROUTE_PATHS.API_STATS,
  API_ROUTE_PATHS.LOGOUT
];

function checkUserQuota(req, res, next) {
  if (!pathsRequiringUserQuota.includes(req.path)) {
    next();
    return;
  }

  const token = req.cookies.token;
  if (!token) {
    return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ error: USER_MESSAGES.auth.tokenNotFound });
  }

  getUserQuotaFromToken(token)
    .then(({ userQuota, token }) => {
      res.setHeader(STANDARD_HEADERS.ACCESS_CONTROL_EXPOSE_HEADERS, CUSTOM_HEADERS.API_LIMIT_EXCEEDED);
      res.setHeader(CUSTOM_HEADERS.API_LIMIT_EXCEEDED, userQuota <= 0);

      res.cookie(COOKIE_KEYS.TOKEN, token, COOKIE_CONFIG);

      next();
    })
    .catch(() => {
      res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ error: USER_MESSAGES.auth.errorValidatingToken });
      return;
    });
}

module.exports = {
  checkUserQuota
};