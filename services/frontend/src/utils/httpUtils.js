import axios from 'axios'

const productionApiUrl = 'https://bqw91brfqd.execute-api.us-east-2.amazonaws.com/Prod';
const apiUrl = process.env.REACT_APP_SERVER_URL ?? productionApiUrl;

export const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: apiUrl
});

export const API_PATHS = {
    login: '/login',
    register: '/register',
    role: '/role',
    news: '/news',
    bookmarkWord: '/bookmark-word',
}

export const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    UNAUTHORIZED: 401,
}
