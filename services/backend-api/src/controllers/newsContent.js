const { USER_MESSAGES } = require('../messages/userMessage');
const { vsprintf } = require('sprintf-js');
const { SERVER_MESSAGES } = require('../messages/serverMessage');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
const { searchNews, getTrendingNews } = require('../utils/newsUtils');

const isMissingKeyword = (keyword) => {
    return keyword === undefined || keyword.trim() === "";
}

async function searchNewsController(req, res) {
    const { keyword } = req.query;
    if (isMissingKeyword(keyword)) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.missingKeyword });
        return;
    }

    searchNews(keyword)
        .then((news) => {
            res.json(news);
        })
        .catch((err) => {
            console.error(vsprintf(SERVER_MESSAGES.news.failedToSearchNews, [err?.stack ?? err]))
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.news.failedToSearchNews });
        });
}

async function getTrendingNewsController(req, res) {
    getTrendingNews()
        .then((news) => {
            res.json(news);
        })
        .catch((err) => {
            console.error(vsprintf(SERVER_MESSAGES.news.failedToGetTrendingNews, [err?.stack ?? err]))
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.news.failedToGetTrendingNews });
        });
}

module.exports = {
    searchNewsController,
    getTrendingNewsController
}