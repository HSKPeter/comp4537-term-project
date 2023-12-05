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
            res.status(500).json({ error: 'Internal server error' });
        });
    } catch (error) {
        console.error('Error retrieving bookmarked words: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function postBookmarkWordController(req, res) {
    try {
        const {userID} = req.params;
    
        const { word } = req.body;

        if (word.length === 0) {
            res.status(409).json({ error: 'Word is required' });
            return;
        }

        // Check if word exists in the database
        let wordExists = await runSQLQuery('SELECT * FROM BookmarkWord WHERE UserID = ? AND Word = ?', [userID, word]);
        if (wordExists.length > 0) {
            res.status(409).json({ error: `Word '${word}' already bookmarked` });
            return;
        }

        console.log(`Bookmarking word: ${word}`);

        runSQLQuery('INSERT INTO BookmarkWord (UserID, Word) VALUES (?, ?)', [userID, word])
            .catch((err) => {
                console.error('Error bookmarking word: ', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            });

        res.status(201).json({ message: `"${word}" bookmarked successfully` });
        
    } catch (error) {
        console.error('Error bookmarking word: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function postBookmarkWordController(req, res) {
    try {
        const {userID} = req.params;

        const { originalWord, newWord } = req.body;

        // Check if original word exists
        let wordExists = await runSQLQuery('SELECT * FROM BookmarkWord WHERE UserID = ? AND Word = ?', [userID, originalWord]);
        if (wordExists.length === 0) {
            res.status(400).json({ error: `Word '${originalWord}' not found` });
            return;
        }
    
        let rows = runSQLQuery('UPDATE BookmarkWord SET Word = ? WHERE UserID = ? AND Word = ?', [newWord, userID, originalWord])
            .then(() => {
                res.status(200).json({ message: 'Word updated successfully' });
            })
            .catch((err) => {
                console.error('Error updating bookmarked word: ', err);
                res.status(500).json({ error: 'Internal server error' });
            });
    } catch (error) {
        console.error('Error updating bookmarked word: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteBookmarkWordController(req, res) {
    try {
        const {userID} = req.params;

        const toDeleteAll = req.query.all === 'true';
    
        if (toDeleteAll) {
            runSQLQuery('DELETE FROM BookmarkWord WHERE UserID = ?', [userID])
            .then(() => {
                res.status(200).json({ message: 'All words deleted successfully' });
            })
            .catch((err) => {
                console.error('Error deleting all bookmarked words: ', err);
                res.status(500).json({ error: 'Internal server error' });
            });
            return;
        } 
    
        const { word } = req.body;

        // Check if the words array is empty
        if (!word) {
            res.status(400).json({ error: 'Received an empty string!' });
            return;
        }

        // Checks if the word exists in the database
        let wordExists = await runSQLQuery('SELECT * FROM BookmarkWord WHERE UserID = ? AND Word = ?', [userID, word]);
        if (wordExists.length === 0) {
            res.status(400).json({ error: `Word '${word}' not found` });
            return;
        }
        
        console.log(`Deleting word: ${word}`);

        // Delete the word from the database
        runSQLQuery('DELETE FROM BookmarkWord WHERE UserID = ? AND Word = ?', [userID, word])
            .catch((err) => {
                console.error('Error deleting bookmarked word: ', err);
                res.status(500).json({ error: 'Internal server error' });
            });

                res.status(200).json({ message: 'Words deleted successfully' });
    } catch (error) {
        console.error('Error deleting bookmarked word: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



