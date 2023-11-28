const USER_MESSAGES = {
    test: 'Hello World!', // TODO: Remove this line
    generalError: 'Something went wrong. Please try again later.',
    missingText: 'Missing text. Please provide text to summarize.',
    missingKeyword: 'Missing keyword in query. Please provide keyword to search for.',
    missingEmailOrPassword: 'Missing email or password.',
    failedToSummarizeText: 'Failed to summarize text. Please try again later.',
    failedToGetNews: 'Failed to get news. Please try again later.',
    failedToRegisterUser: 'Failed to register. Please try again later.',
    invalidCredentials: 'Invalid credentials.',
    auth: {
        tokenNotFound: 'Token not found.',
        userQuotaExceeded: 'User quota exceeded.',
        errorValidatingToken: 'Error occurred when validating token.',
    },
    role: {
        roleNotFound: 'Role not found.',
    },
    registration: {
        missingEmailOrPassword: 'Missing email or password.',
        failure: 'Failed to register. Please try again later.',
        success: 'User registered successfully.',

    }
};

module.exports = {
    USER_MESSAGES,
};