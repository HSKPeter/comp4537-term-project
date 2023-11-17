require('dotenv').config();  // Read .env file if it exists

// TODO: Update production configs
const PRODUCTION_CONFIGS = {
    backendOrigin: 'TBC',
    frontendOrigin: 'TBC',
    port: 80,
};

const LOCAL_HOST = 'http://localhost';

const PORTS = {
    development: {
        frontend: 3000,
        backend: 8080
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

const WHITE_LIST_ORIGINS = [FRONTEND_ORIGIN, BACKEND_ORIGIN];

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

module.exports = {
    PORT,
    WHITE_LIST_ORIGINS,
    BACKEND_ORIGIN,
    MODE,
    HUGGINGFACE_API_TOKEN
};
    