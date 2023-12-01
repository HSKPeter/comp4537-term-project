const { authAxiosInstance } = require('./httpUtils');

async function getBookmarkWords() {
    const result = await authAxiosInstance.get('/bookmark-words');
    return result.data.bookmarkWords;
}

async function addBookmarkWord(word) {
    const result = await authAxiosInstance.post('/bookmark-word', { word });
    return result.data.message;
}

async function editBookmarkWord(originalWord, newWord) {
    const result = await authAxiosInstance.put('/bookmark-word', { originalWord, newWord });
    return result.data.message;
}

async function deleteBookmarkWord(word) {
    const result = await authAxiosInstance.delete('/bookmark-word', { data: { word } });
    return result.data.message;
}

async function deleteAllBookmarkWords() {
    const result = await authAxiosInstance.delete('/bookmark-words');
    return result.data.message;
}

module.exports = {
    getBookmarkWords,
    addBookmarkWord,
    editBookmarkWord,
    deleteBookmarkWord,
    deleteAllBookmarkWords,
};