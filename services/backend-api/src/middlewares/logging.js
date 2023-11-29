const { vsprintf } = require("sprintf-js");
const { SERVER_MESSAGES } = require("../messages/serverMessage");


function logging(req, res, next) {
  console.log(vsprintf(SERVER_MESSAGES.requestReceived, [req.method, req.path]));
  next();
}

module.exports = {
  logging
};