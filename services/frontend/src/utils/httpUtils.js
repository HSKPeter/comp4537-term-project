import axios from 'axios'

const productionApiUrl = 'https://bqw91brfqd.execute-api.us-east-2.amazonaws.com/Prod/api/v1';

const apiUrl = (process.env.REACT_APP_SERVER_URL ?? productionApiUrl);


export const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: apiUrl
});

export const API_PATHS = {
    login: '/login',
    logout: '/logout',
    register: '/register',
    role: '/role',
    apiStats: '/api-stats',
    usersInfo: '/users-info',
    apiConsumption: '/api-consumption',
    deleteUser: '/delete-user', // TODO: Remove this and all its usages
    searchNews: '/search-news',
    trendingNews: '/trending-news',
    bookmarkWords: '/bookmark-words',
    summarizeText: '/summarize-text',
}

export const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    UNAUTHORIZED: 401,
}

export const ROUTER_PATHS = {
    index: '/',
    login: '/login',
    admin: '/admin',
}
