const { HTTP_STATUS_CODES } = require("../utils/httpUtils");

function getBookmarkWordsController(req, res) {
    res.status(HTTP_STATUS_CODES.OK).json({ bookmarkWords: ['sam altman', 'javascript'] });
}

function addBookmarkWordController(req, res) {
    const { word } = req.body;

    console.log("Adding word: ", word)

    if (!word) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: 'Missing word' });
        return;
    }

    res.status(HTTP_STATUS_CODES.CREATED).json({ message: 'Word added' });
}

function editBookmarkWordController(req, res) {
    const { originalWord, newWord } = req.body;

    if (!originalWord || !newWord) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: 'Missing word' });
        return;
    }

    console.log(`Editing word: ${originalWord} to ${newWord}`);

    res.status(HTTP_STATUS_CODES.OK).json({ message: 'Word edited' });
}

function deleteBookmarkWordController(req, res) {
    const { word } = req.body;

    console.log(`Deleting word: ${word}`);

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