const { summarizeText } = require('../utils/huggingfaceUtils');
const { USER_MESSAGES } = require('../messages/userMessage');
const { vsprintf } = require('sprintf-js');
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');

async function textSummarizationController(req, res) {
    const { text } = req.body;
    if (text === undefined) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.missingText });
        return;
    }

    summarizeText(text)
        .then((summary) => {
            res.json({ summary });
        })
        .catch((err) => {
            console.error(vsprintf(SERVER_MESSAGES.failedToSummarizeText, [err?.stack ?? err]))
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.failedToSummarizeText });
        });
}

module.exports = {
    textSummarizationController
}