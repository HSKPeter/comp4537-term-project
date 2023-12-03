const COOKIE_CONFIG = {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    overwrite: true,
    maxAge: 1000 * 60 * 15 // 15 minutes
};

const COOKIE_KEYS = {
    TOKEN: 'token',
}

module.exports = {
    COOKIE_CONFIG,
    COOKIE_KEYS
};