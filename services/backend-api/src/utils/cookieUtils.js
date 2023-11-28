const COOKIE_CONFIG = {
    httpOnly: true,
    sameSite: 'Strict',
    secure: true,
};

const COOKIE_KEYS = {
    TOKEN: 'token',
}

module.exports = {
    COOKIE_CONFIG,
    COOKIE_KEYS
};