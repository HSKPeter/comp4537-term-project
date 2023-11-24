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
  const token = req.cookies.token ?? parseBearerToken(req.headers);
  if (!token) {
    return res.status(401).json({ error: 'Token not found' });
  }

  getUserQuotaFromToken(token)
    .then((userQuota) => {
      if (userQuota <= 0) {
        return res.status(401).json({ error: 'User quota exceeded' });
      }
      next();
    })
    .catch((err) => {
      return res.status(401).json({ error: 'Error occurred when validating token' });
    });
}

module.exports = {
  checkUserQuota
};