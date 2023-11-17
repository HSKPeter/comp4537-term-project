const { summarizeText } = require('../utils/huggingFaceUtils');
const { USER_MESSAGES } = require('../messages/userMessage');
const { vsprintf } = require('sprintf-js');
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');

async function textSummarizationController(req, res) {
    try {
        const { text } = req.body;
        summarizeText(text).then((summary) => {
            res.json({ summary });
        });
    } catch (err) {
        console.error(vsprintf(SERVER_MESSAGES.failedToSummarizeText, [err?.stack ?? err]))
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.failedToSummarizeText });
    }
}

module.exports = {
    textSummarizationController
}