const { USER_MESSAGES } = require('../messages/userMessage');
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

function checkUserQuota(req, res, next) {
  const token = req.cookies.token ?? parseBearerToken(req.headers); // TODO: Remove parsing of Authorization header after development is done
  if (!token) {
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.auth.tokenNotFound });
  }
  
  console.log(token);

  getUserQuotaFromToken(token)
    .then((userQuota) => {
      if (userQuota <= 0) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.auth.userQuotaExceeded });
      }
      next();
    })
    .catch((err) => {
      return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.auth.errorValidatingToken });
    });
}

module.exports = {
  checkUserQuota
};