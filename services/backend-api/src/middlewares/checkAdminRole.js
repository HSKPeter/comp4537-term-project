const { USER_MESSAGES } = require('../messages/userMessage');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
const { getRoleFromToken, USER_ROLES } = require('../utils/userAuthenticationUtils');

const pathsExclusiveToAdmin = [
  // TODO: Add paths exclusive to admin
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
    .then((userRole) => {
      if (userRole !== USER_ROLES.ADMIN) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ error: USER_MESSAGES.auth.notAdmin });
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
  checkAdminRole
};