const API_ROUTE_PATHS = {
    ROOT: '/api/v1',
    LOGIN: '/login',
    LOGOUT: '/logout',
    REGISTER: '/register',
    ROLE: '/role',
    SUMMARIZE_TEXT: '/summarize-text',
    TRENDING_NEWS: '/trending-news',
    SEARCH_NEWS: '/search-news',
    API_STATS: '/api-stats',
    API_STATS_BY_USER: '/users-info',
    API_CONSUMPTION: '/api-consumption',
    BOOKMARK_WORDS: '/bookmark-words'
};

const ROUTE_PATHS = {
    ...API_ROUTE_PATHS,
    SWAGGER: '/api-docs'
}

module.exports = {
    API_ROUTE_PATHS,
    ROUTE_PATHS
};