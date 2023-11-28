const { USER_MESSAGES } = require('../messages/userMessage');
const { API_ROUTE_PATHS } = require('../router/routes');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
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
  API_ROUTE_PATHS.NEWS_CONTENT,
  API_ROUTE_PATHS.SUMMARIZE_TEXT,
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
    .then((userQuota) => {
      if (userQuota <= 0) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ error: USER_MESSAGES.auth.userQuotaExceeded });
        return;
      }
      next();
    })
    .catch((_err) => {
      res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ error: USER_MESSAGES.auth.errorValidatingToken });
      return;
    });
}

module.exports = {
  checkUserQuota
};