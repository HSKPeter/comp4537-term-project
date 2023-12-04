const { authAxiosInstance, AUTH_SERVER_API_ENDPOINTS } = require('./httpUtils');

const QUERY_PARAM_TO_DELETE_ALL = '?all=true';

async function getBookmarkWords(userId) {
    const result = await authAxiosInstance.get(AUTH_SERVER_API_ENDPOINTS.BOOKMARK_WORDS + `/${userId}`);
    return result.data.words;
}

async function addBookmarkWord({word, userId}) {
    const result = await authAxiosInstance.post(AUTH_SERVER_API_ENDPOINTS.BOOKMARK_WORDS + `/${userId}`, { word });
    return result.data.message;
}

async function editBookmarkWord({originalWord, newWord, userId}) {
    const result = await authAxiosInstance.put(AUTH_SERVER_API_ENDPOINTS.BOOKMARK_WORDS + `/${userId}`, { originalWord, newWord });
    return result.data.message;
}

async function deleteBookmarkWord({word, userId}) {
    await authAxiosInstance.delete(AUTH_SERVER_API_ENDPOINTS.BOOKMARK_WORDS + `/${userId}`, { data: { word } });
}

async function deleteAllBookmarkWords(userId) {
    await authAxiosInstance.delete(AUTH_SERVER_API_ENDPOINTS.BOOKMARK_WORDS + `/${userId}` + QUERY_PARAM_TO_DELETE_ALL)
}

module.exports = {
    getBookmarkWords,
    addBookmarkWord,
    editBookmarkWord,
    deleteBookmarkWord,
    deleteAllBookmarkWords,
};