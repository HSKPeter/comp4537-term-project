const { validateToken } = require("../utils/userAuthenticationUtils");

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

function tokenAuth(req, res, next) {
  const token = req.cookies.token ?? parseBearerToken(req.headers);
  if (!token) {
    return res.status(401).json({ error: 'Token not found' });
  }
  validateToken(token)
    .then((isValid) => {
      if (!isValid) {
        return res.status(401).json({ error: 'Token invalid' });
      }
      next();
    })
    .catch((err) => {
      return res.status(401).json({ error: 'Token invalid' });
    });
}

module.exports = {
  tokenAuth
};