const API_ROUTE_PATHS = {
    ROOT: '/',
    LOGIN: '/login',
    LOGOUT: '/logout',
    REGISTER: '/register',
    ROLE: '/role',
    SUMMARIZE_TEXT: '/summarize-text',
    NEWS_CONTENT: '/news',
    LOGIN: '/login',
};

const ROUTE_PATHS = {
    ...API_ROUTE_PATHS,
    SWAGGER: '/api-docs'
}

module.exports = {
    API_ROUTE_PATHS,
    ROUTE_PATHS
};