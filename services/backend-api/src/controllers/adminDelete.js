const { vsprintf } = require('sprintf-js');
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
const adminUtils = require('../utils/adminUtils');

async function adminDeleteController(req, res) {
  try {
    const { tableName, entryId } = req.params;
    const result = await adminUtils.deleteEntry(tableName, entryId);
    res.status(HTTP_STATUS_CODES.OK).json(result);
  } catch (error) {
    console.error(vsprintf(SERVER_MESSAGES.failedToDeleteEntry, [error?.stack ?? error]));
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: SERVER_MESSAGES.failedToDeleteEntry });
  }
}

module.exports = {
  adminDeleteController,
};
