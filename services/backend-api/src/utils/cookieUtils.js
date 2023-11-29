const COOKIE_CONFIG = {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    overwrite: true,
};

const COOKIE_KEYS = {
    TOKEN: 'token',
}

module.exports = {
    COOKIE_CONFIG,
    COOKIE_KEYS
};