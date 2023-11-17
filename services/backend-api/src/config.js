const MODES = {
    development: 'development',
    production: 'production'
}

const IS_DEVELOPMENT_MODE = process.env.NODE_ENV === MODES.development;

const MODE = IS_DEVELOPMENT_MODE ? MODES.development : MODES.production;

const PORTS = {
    development: {
        frontend: 3000,
        backend: 8080
    },
    production: 80
};

const PORT = IS_DEVELOPMENT_MODE ? PORTS.development.backend : PORTS.production;

const LOCAL_HOST = 'http://localhost';
const FRONTEND_ORIGIN = IS_DEVELOPMENT_MODE ? `${LOCAL_HOST}:${PORTS.development.frontend}` : 'TODO';
const BACKEND_ORIGIN = IS_DEVELOPMENT_MODE ? `${LOCAL_HOST}:${PORTS.development.backend}` : 'TODO';

const WHITE_LIST_ORIGINS = [FRONTEND_ORIGIN, BACKEND_ORIGIN];

module.exports = {
    PORT,
    WHITE_LIST_ORIGINS,
    BACKEND_ORIGIN,
    MODE
};
    