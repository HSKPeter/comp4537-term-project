const { vsprintf } = require('sprintf-js');
const { CUSTOM_EXCEPTION_NAMES } = require('../exceptions');
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { USER_MESSAGES } = require('../messages/userMessage');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
const { COOKIE_CONFIG, COOKIE_KEYS } = require('../utils/cookieUtils');
const { loginUser } = require('../utils/userUtils');

function userLoginController(req, res) {
  try {
    const { email, password } = req.body;
    if (email === undefined || password === undefined) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.missingEmailOrPassword });
      return;
    }
    const token = "123";
    res.cookie(COOKIE_KEYS.TOKEN, token, COOKIE_CONFIG);
    res.status(HTTP_STATUS_CODES.NO_CONTENT).json({ token });
    // loginUser({ email, password })
    //   .then((token) => {
    //     // res.cookie(COOKIE_KEYS.TOKEN, token, COOKIE_CONFIG);
    //     // res.status(HTTP_STATUS_CODES.NO_CONTENT).send();
    //     res.status(HTTP_STATUS_CODES.OK).json({ token });
    //   })
    //   .catch((err) => {
    //     console.error(vsprintf(SERVER_MESSAGES.failedToLoginUser, [err?.stack ?? err]))

    //     if (err?.name === CUSTOM_EXCEPTION_NAMES.USER_UNAUTHORIZED) {
    //       res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ error: err?.message ?? USER_MESSAGES.failedToLoginUser });
    //       return;
    //     }

    //     res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.failedToLoginUser });
    //   });

  } catch (err) {
    console.error(vsprintf(SERVER_MESSAGES.failedToLoginUser, [err?.stack ?? err]))
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.failedToLoginUser });
  }
}

module.exports = {
  userLoginController
}