const { USER_MESSAGES } = require('../messages/userMessage');
const { API_ROUTE_PATHS } = require('../router/routes');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
const { COOKIE_KEYS, COOKIE_CONFIG } = require('../utils/cookieUtils');
const { getUserQuotaFromToken } = require('../utils/userAuthenticationUtils');

const BEARER = 'Bearer';

function parseBearerToken(headers) {
  try {
    const authHeader = headers.authorization;
    if (authHeader === undefined) {
      return undefined;
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== BEARER) {
      return undefined;
    }
    return token;
  } catch (err) {
    return undefined;
  }
}

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

  const token = req.cookies.token ?? parseBearerToken(req.headers); // TODO: Remove parsing of Authorization header after development is done
  if (!token) {
    return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ error: USER_MESSAGES.auth.tokenNotFound });
  }

  getUserQuotaFromToken(token)
    .then(({ userQuota, token }) => {
      if (userQuota <= 0) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ error: USER_MESSAGES.auth.userQuotaExceeded });
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
  checkUserQuota
};