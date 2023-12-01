const { vsprintf } = require("sprintf-js");
const { USER_MESSAGES } = require("../messages/userMessage");
const { HTTP_STATUS_CODES } = require("../utils/httpUtils");
const { addBookmarkWord, editBookmarkWord, deleteBookmarkWord, deleteAllBookmarkWords } = require("../utils/bookmarkWordUtils");

function getBookmarkWordsController(req, res) {
    res.status(HTTP_STATUS_CODES.OK).json({ bookmarkWords: ['sam altman', 'javascript'] });
}

function addBookmarkWordController(req, res) {
    const { word } = req.body;

    if (!word) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.wordBookmark.missingFields });
        return;
    }

    addBookmarkWord(word)
        .then(() => {
            res.status(HTTP_STATUS_CODES.CREATED).json({ message: vsprintf(USER_MESSAGES.wordBookmark.addSuccess, [word]) });
        })
        .catch(() => {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.wordBookmark.addFailure });
        });
}

function editBookmarkWordController(req, res) {
    const { originalWord, newWord } = req.body;

    if (!originalWord || !newWord) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.wordBookmark.missingFields });
        return;
    }

    editBookmarkWord(originalWord, newWord)
        .then(() => {
            res.status(HTTP_STATUS_CODES.OK).json({ message: vsprintf(USER_MESSAGES.wordBookmark.editSuccess, [originalWord, newWord]) });
        })
        .catch(() => {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.wordBookmark.editFailure });
        });
}

function deleteBookmarkWordController(req, res) {
    const { word } = req.body;

    if (!word) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.wordBookmark.missingFields });
        return;
    }

    deleteBookmarkWord(word)
        .then(() => {
            res.status(HTTP_STATUS_CODES.NO_CONTENT);
            res.end();
        })
        .catch(() => {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: USER_MESSAGES.wordBookmark.deleteFailure });
        });
}

function deleteAllBookmarkWordsController(req, res) {
    deleteAllBookmarkWords()
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
    deleteAllBookmarkWordsController
}