const API_ROUTE_PATHS = {
    ROOT: '/',
    SUMMARIZE_TEXT: '/summarize-text',
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