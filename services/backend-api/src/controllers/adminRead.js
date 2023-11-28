const { vsprintf } = require('sprintf-js');
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
const adminUtils = require('../utils/adminUtils');

async function adminReadController(req, res) {
  try {
    const { tableName } = req.params;
    const result = await adminUtils.readAllFields(tableName);
    res.status(HTTP_STATUS_CODES.OK).json(result);
  } catch (error) {
    console.error(vsprintf(SERVER_MESSAGES.failedToGetAllFields, [error?.stack ?? error]));
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: SERVER_MESSAGES.failedToGetAllFields });
  }
}

module.exports = {
  adminReadController,
};
