const { authAxiosInstance } = require('./httpUtils');

async function getBookmarkWords(userId) {
    const result = await authAxiosInstance.get('/bookmark-words' + `/${userId}`);
    return result.data.words;
}

async function addBookmarkWord({word, userId}) {
    const result = await authAxiosInstance.post('/bookmark-words' + `/${userId}`, { word });
    return result.data.message;
}

async function editBookmarkWord({originalWord, newWord, userId}) {
    const result = await authAxiosInstance.put('/bookmark-words' + `/${userId}`, { originalWord, newWord });
    return result.data.message;
}

async function deleteBookmarkWord({word, userId}) {
    await authAxiosInstance.delete('/bookmark-words' + `/${userId}`, { data: { word } });
}

async function deleteAllBookmarkWords(userId) {
    await authAxiosInstance.delete('/bookmark-words' + `/${userId}` + '?all=true')
}

module.exports = {
    getBookmarkWords,
    addBookmarkWord,
    editBookmarkWord,
    deleteBookmarkWord,
    deleteAllBookmarkWords,
};