const { HTTP_STATUS_CODES } = require("../utils/httpUtils");

function getBookmarkWordsController(req, res) {
    res.status(HTTP_STATUS_CODES.OK).json({ bookmarkWords: ['elon', 'openai', 'javascript'] });
}

function addBookmarkWordController(req, res) {
    const { word } = req.body;

    if (!word) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: 'Missing word' });
        return;
    }

    res.status(HTTP_STATUS_CODES.CREATED).json({ message: 'Word added' });
}

function editBookmarkWordController(req, res) {
    const { word } = req.body;

    if (!word) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: 'Missing word' });
        return;
    }

    res.status(HTTP_STATUS_CODES.OK).json({ message: 'Word edited' });
}

function deleteBookmarkWordController(req, res) {
    const { word } = req.body;

    if (!word) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: 'Missing word' });
        return;
    }

    res.status(HTTP_STATUS_CODES.OK).json({ message: 'Word deleted' });
}

module.exports = {
    getBookmarkWordsController,
    addBookmarkWordController,
    editBookmarkWordController,
    deleteBookmarkWordController
}