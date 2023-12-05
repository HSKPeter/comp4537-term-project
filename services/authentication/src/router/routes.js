const API_ROUTE_PATHS = {
    ROOT: '/COMP4537/project/api/v2/authentication',
    REGISTER: '/register',
    LOGIN: '/login',
    USER: '/user',
    ROLE: '/role',
    RECORD: '/record',
    GET_BOOKMARK_WORDS: '/bookmark-words/:userID',
    POST_BOOKMARK_WORDS: '/bookmark-words/:userID',
    PUT_BOOKMARK_WORDS: '/bookmark-words/:userID',
    DELETE_BOOKMARK_WORDS: '/bookmark-words/:userID',
    API_STATS: '/api-stats',
    USERS_INFO: '/users-info',
    API_CONSUMPTION: '/api-consumption/:userID',
}

const ROUTE_PATHS = {
    ...API_ROUTE_PATHS,
    SWAGGER: '/api-docs',
    PORT: 8000
}

module.exports = {
    ROUTE_PATHS
}
