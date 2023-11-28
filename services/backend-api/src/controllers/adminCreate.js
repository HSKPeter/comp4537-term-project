const { vsprintf } = require('sprintf-js');
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
const adminUtils = require('../utils/adminUtils');

async function adminCreateController(req, res) {
  try {
    const { tableName } = req.params;
    const data = req.body;
    const result = await adminUtils.createEntry(tableName, data);
    res.status(HTTP_STATUS_CODES.CREATED).json(result);
  } catch (error) {
    console.error(vsprintf(SERVER_MESSAGES.failedToCreateEntry, [error?.stack ?? error]));
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: SERVER_MESSAGES.failedToCreateEntry });
  }
}

module.exports = {
  adminCreateController,
};
