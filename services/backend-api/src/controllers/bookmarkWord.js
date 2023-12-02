const { vsprintf } = require("sprintf-js");
const { USER_MESSAGES } = require("../messages/userMessage");
const { HTTP_STATUS_CODES } = require("../utils/httpUtils");
const { getBookmarkWords, addBookmarkWord, editBookmarkWord, deleteBookmarkWord, deleteAllBookmarkWords } = require("../utils/bookmarkWordUtils");
const { readUserId } = require("../utils/tokenUtils");

function getBookmarkWordsController(req, res) {
    const token = req.cookies.token;
    const userId = readUserId(token);
    getBookmarkWords(userId)
        .then((words) => {
            res.status(HTTP_STATUS_CODES.OK).json({ words });
        })
        .catch(() => {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.wordBookmark.readFailure });
        });
}

function addBookmarkWordController(req, res) {
    const { word } = req.body;
    const token = req.cookies.token;
    const userId = readUserId(token);

    if (!word) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.wordBookmark.missingFields });
        return;
    }

    addBookmarkWord({ word, userId })
        .then(() => {
            res.status(HTTP_STATUS_CODES.CREATED).json({ message: vsprintf(USER_MESSAGES.wordBookmark.addSuccess, [word]) });
        })
        .catch(() => {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.wordBookmark.addFailure });
        });
}

function editBookmarkWordController(req, res) {
    const { originalWord, newWord } = req.body;
    const token = req.cookies.token;
    const userId = readUserId(token);

    if (!originalWord || !newWord) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.wordBookmark.missingFields });
        return;
    }

    editBookmarkWord({ originalWord, newWord, userId})
        .then(() => {
            res.status(HTTP_STATUS_CODES.OK).json({ message: vsprintf(USER_MESSAGES.wordBookmark.editSuccess, [originalWord, newWord]) });
        })
        .catch(() => {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.wordBookmark.editFailure });
        });
}

function deleteBookmarkWordController(req, res) {
    const toDeleteAll = req.query.all === 'true';
    const token = req.cookies.token;
    const userId = readUserId(token);

    if (toDeleteAll) {
        deleteAllBookmarkWords(userId)
            .then(() => {
                res.status(HTTP_STATUS_CODES.NO_CONTENT);
                res.end();
            })
            .catch(() => {
                res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.wordBookmark.deleteFailure });
            });
        return;
    }

    const { word } = req.body;

    if (!word) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.wordBookmark.missingFields });
        return;
    }

    deleteBookmarkWord({ word, userId })
        .then(() => {
            res.status(HTTP_STATUS_CODES.NO_CONTENT);
            res.end();
        })
        .catch(() => {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.wordBookmark.deleteFailure });
        });
}

module.exports = {
    getBookmarkWordsController,
    addBookmarkWordController,
    editBookmarkWordController,
    deleteBookmarkWordController,
}