const PORT = process.env.PORT ?? 8080;

const WHITE_LIST_ORIGINS = [
    'http://localhost:3000',
];

module.exports = {
    PORT,
    WHITE_LIST_ORIGINS
};
    