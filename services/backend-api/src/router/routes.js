const API_ROUTE_PATHS = {
    ROOT: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    SUMMARIZE_TEXT: '/summarize-text',
    NEWS_CONTENT: '/news',
    LOGIN: '/login',
    READ_ALL_FIELDS: '/readAllFields',
    CREATE_ENTRY: '/createEntry',
    UPDATE_ENTRY: '/updateEntry',
    DELETE_ENTRY: '/deleteEntry',
};

const ROUTE_PATHS = {
    ...API_ROUTE_PATHS,
    SWAGGER: '/api-docs'
}

module.exports = {
    API_ROUTE_PATHS,
    ROUTE_PATHS
};