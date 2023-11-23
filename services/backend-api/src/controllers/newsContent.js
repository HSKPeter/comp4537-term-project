const { USER_MESSAGES } = require('../messages/userMessage');
const { vsprintf } = require('sprintf-js');
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
const { getNews } = require('../utils/newsUtils');

async function newsContentController(req, res) {
    const { keyword } = req.query;
    if (keyword === undefined) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.missingKeyword });
        return;
    }

    getNews(keyword)
        .then((news) => {
            res.json(news);
        })
        .catch((err) => {
            console.error(vsprintf(SERVER_MESSAGES.failedToGetNews, [err?.stack ?? err]))
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.failedToGetNews });
        });
}

module.exports = {
    newsContentController
}