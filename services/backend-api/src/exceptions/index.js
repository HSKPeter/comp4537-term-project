const CUSTOM_EXCEPTION_NAMES = {
    USER_UNAUTHORIZED: 'UserUnauthorizedException',
    AUTH_SERVER_ERROR: 'AuthenticationServerException',
}

class UserUnauthorizedException extends Error {
    constructor(message) {
        super(message);
        this.name = CUSTOM_EXCEPTION_NAMES.USER_UNAUTHORIZED;
    }
}

class AuthenticationServerException extends Error {
    constructor(message) {
        super(message);
        this.name = CUSTOM_EXCEPTION_NAMES.AUTH_SERVER_ERROR;
    }
}

module.exports = {
    UserUnauthorizedException,
    AuthenticationServerException,
    CUSTOM_EXCEPTION_NAMES
}

