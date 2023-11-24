require('dotenv').config();  // Read .env file if it exists

// TODO: Update production configs
const PRODUCTION_CONFIGS = {
    backendOrigin: 'TBC',
    frontendOrigin: 'TBC',
    authServerOrigin: 'TBC',
    port: 80,
};

const LOCAL_HOST = 'http://localhost';

const PORTS = {
    development: {
        frontend: 3000,
        backend: 8080,
        auth: 8000
    },
    production: PRODUCTION_CONFIGS.port
};

const MODES = {
    development: 'development',
    production: 'production'
};

const IS_DEVELOPMENT_MODE = process.env.NODE_ENV === MODES.development;

const MODE = IS_DEVELOPMENT_MODE ? MODES.development : MODES.production;

const PORT = IS_DEVELOPMENT_MODE ? PORTS.development.backend : PORTS.production;

const FRONTEND_ORIGIN = IS_DEVELOPMENT_MODE ? `${LOCAL_HOST}:${PORTS.development.frontend}` : PRODUCTION_CONFIGS.frontendOrigin;
const BACKEND_ORIGIN = IS_DEVELOPMENT_MODE ? `${LOCAL_HOST}:${PORTS.development.backend}` : PRODUCTION_CONFIGS.backendOrigin;
const AUTH_SERVER_ORIGIN = IS_DEVELOPMENT_MODE ? `${LOCAL_HOST}:${PORTS.development.auth}` : PRODUCTION_CONFIGS.authServerOrigin;

const WHITE_LIST_ORIGINS = [FRONTEND_ORIGIN, BACKEND_ORIGIN];

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const NEWS_DATA_API_KEY = process.env.NEWS_DATA_API_KEY;

module.exports = {
    PORT,
    WHITE_LIST_ORIGINS,
    BACKEND_ORIGIN,
    AUTH_SERVER_ORIGIN,
    MODE,
    IS_DEVELOPMENT_MODE,
    HUGGINGFACE_API_TOKEN,
    NEWS_DATA_API_KEY
};
    