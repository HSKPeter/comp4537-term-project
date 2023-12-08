const { runSQLQuery } = require('../utils/sqlUtil');
const { USER_STRINGS, formatUserString } = require('../utils/userStrings');

async function getBookmarkWordController(req, res) {
    try {
        const {userID} = req.params;
        runSQLQuery('SELECT word FROM BookmarkWord WHERE UserID = ?', [userID])
        .then((wordsQueryResults) => {
            const words = wordsQueryResults.map((wordQueryResult) => wordQueryResult.word);
            // Set Cache-Control header to prevent caching
            res.setHeader('Cache-Control', 'no-store');
            res.status(200).json({ words });
        })
        .catch((err) => {
            console.error('Error retrieving bookmarked words: ', err);
            res.status(500).json({ error: USER_STRINGS.SERVER_ERROR });
        });
    } catch (error) {
        console.error('Error retrieving bookmarked words: ', error);
        res.status(500).json({ error: USER_STRINGS.SERVER_ERROR });
    }
}

async function postBookmarkWordController(req, res) {
    try {
        const {userID} = req.params;
    
        const { word } = req.body;

        if (word.length === 0) {
            res.status(409).json({ error: USER_STRINGS.WORD_REQUIRED });
            return;
        }

        // Check if word exists in the database
        let wordExists = await runSQLQuery('SELECT * FROM BookmarkWord WHERE UserID = ? AND Word = ?', [userID, word]);
        if (wordExists.length > 0) {
            res.status(409).json({ error: formatUserString(USER_STRINGS.ALREADY_BOOKMARKED, [word]) });
            return;
        }

        console.log(`Bookmarking word: ${word}`);

        runSQLQuery('INSERT INTO BookmarkWord (UserID, Word) VALUES (?, ?)', [userID, word])
            .catch((err) => {
                console.error('Error bookmarking word: ', err);
                res.status(500).json({ error: USER_STRINGS.SERVER_ERROR });
                return;
            });

        res.status(201).json({ message: formatUserString(USER_STRINGS.BOOKMARKED_SUCCESSFULLY, [word]) });
        
    } catch (error) {
        console.error('Error bookmarking word: ', error);
        res.status(500).json({ error: USER_STRINGS.SERVER_ERROR });
    }
}

async function putBookmarkWordController(req, res) {
    try {
        const {userID} = req.params;

        const { originalWord, newWord } = req.body;

        // Check if original word exists
        let wordExists = await runSQLQuery('SELECT * FROM BookmarkWord WHERE UserID = ? AND Word = ?', [userID, originalWord]);
        if (wordExists.length === 0) {
            res.status(400).json({ error: formatUserString(USER_STRINGS.WORD_NOT_FOUND, [originalWord]) });
            return;
        }
    
        let rows = runSQLQuery('UPDATE BookmarkWord SET Word = ? WHERE UserID = ? AND Word = ?', [newWord, userID, originalWord])
            .then(() => {
                res.status(200).json({ message: USER_STRINGS.WORD_UPDATED_SUCESSFULLY });
            })
            .catch((err) => {
                console.error('Error updating bookmarked word: ', err);
                res.status(500).json({ error: USER_STRINGS.SERVER_ERROR });
            });
    } catch (error) {
        console.error('Error updating bookmarked word: ', error);
        res.status(500).json({ error: USER_STRINGS.SERVER_ERROR });
    }
}

async function deleteBookmarkWordController(req, res) {
    try {
        const {userID} = req.params;

        const toDeleteAll = req.query.all === 'true';
    
        if (toDeleteAll) {
            runSQLQuery('DELETE FROM BookmarkWord WHERE UserID = ?', [userID])
            .then(() => {
                res.status(200).json({ message: USER_STRINGS.WORDS_DELETED_SUCCESSFULLY });
            })
            .catch((err) => {
                console.error('Error deleting all bookmarked words: ', err);
                res.status(500).json({ error: USER_STRINGS.SERVER_ERROR });
            });
            return;
        } 
    
        const { word } = req.body;

        // Check if the words array is empty
        if (!word) {
            res.status(400).json({ error: USER_STRINGS.EMPTY_STRING });
            return;
        }

        // Checks if the word exists in the database
        let wordExists = await runSQLQuery('SELECT * FROM BookmarkWord WHERE UserID = ? AND Word = ?', [userID, word]);
        if (wordExists.length === 0) {
            res.status(400).json({ error: formatUserString(USER_STRINGS.WORD_NOT_FOUND, [word]) });
            return;
        }
        
        console.log(`Deleting word: ${word}`);

        // Delete the word from the database
        runSQLQuery('DELETE FROM BookmarkWord WHERE UserID = ? AND Word = ?', [userID, word])
            .catch((err) => {
                console.error('Error deleting bookmarked word: ', err);
                res.status(500).json({ error: USER_STRINGS.SERVER_ERROR });
            });

                res.status(200).json({ message: formatUserString(USER_STRINGS.DELETED_WORD_SUCCESSFULLY, [word]) });
    } catch (error) {
        console.error('Error deleting bookmarked word: ', error);
        res.status(500).json({ error: USER_STRINGS.SERVER_ERROR });
    }
};

module.exports = {
    getBookmarkWordController,
    postBookmarkWordController,
    putBookmarkWordController,
    deleteBookmarkWordController
}

