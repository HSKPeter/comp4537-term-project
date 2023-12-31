const { vsprintf } = require('sprintf-js');
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { USER_MESSAGES } = require('../messages/userMessage');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
const { COOKIE_CONFIG, COOKIE_KEYS } = require('../utils/cookieUtils');
const { loginUser } = require('../utils/userAuthenticationUtils');
const { recordUsageOfApi } = require('../utils/recordApiUsageUtils');
const { isValidEmail } = require('../utils/validationUtils');

function userLoginController(req, res) {
  try {
    const timestamp = Date.now();
    const { email, username, password } = req.body;
    if (email === undefined || password === undefined || username === undefined) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.login.missingFields });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.login.invalidEmail });
      return;
    }
    
    loginUser({ email, username, password })
      .then(({ token, role }) => {
        recordUsageOfApi({ token, endpoint: req.path, method: req.method, timestamp });
        res.cookie(COOKIE_KEYS.TOKEN, token, COOKIE_CONFIG);
        res.status(HTTP_STATUS_CODES.OK).json({ role });
      })
      .catch((err) => {
        console.error(vsprintf(SERVER_MESSAGES.failedToLoginUser, [err?.stack ?? err]))
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ error: USER_MESSAGES.login.invalid });
      });

  } catch (err) {
    console.error(vsprintf(SERVER_MESSAGES.failedToLoginUser, [err?.stack ?? err]))
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.login.failure });
  }
}

module.exports = {
  userLoginController
}