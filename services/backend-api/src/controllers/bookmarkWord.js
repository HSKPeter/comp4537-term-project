const { vsprintf } = require("sprintf-js");
const { USER_MESSAGES } = require("../messages/userMessage");
const { HTTP_STATUS_CODES } = require("../utils/httpUtils");

function getBookmarkWordsController(req, res) {
    res.status(HTTP_STATUS_CODES.OK).json({ bookmarkWords: ['sam altman', 'javascript'] });
}

function addBookmarkWordController(req, res) {
    const { word } = req.body;

    console.log("Adding word: ", word)

    if (!word) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.wordBookmark.missingFields });
        return;
    }

    res.status(HTTP_STATUS_CODES.CREATED).json({ message: vsprintf(USER_MESSAGES.wordBookmark.addSuccess, [word]) });
}

function editBookmarkWordController(req, res) {
    const { originalWord, newWord } = req.body;

    if (!originalWord || !newWord) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.wordBookmark.missingFields });
        return;
    }

    console.log(`Editing word: ${originalWord} to ${newWord}`);

    res.status(HTTP_STATUS_CODES.OK).json({ message: vsprintf(USER_MESSAGES.wordBookmark.editSuccess, [originalWord, newWord]) });
}

function deleteBookmarkWordController(req, res) {
    const { word } = req.body;

    console.log(`Deleting word: ${word}`);

    if (!word) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: USER_MESSAGES.wordBookmark.missingFields });
        return;
    }

    res.status(HTTP_STATUS_CODES.NO_CONTENT);
    res.end();
}

module.exports = {
    getBookmarkWordsController,
    addBookmarkWordController,
    editBookmarkWordController,
    deleteBookmarkWordController
}