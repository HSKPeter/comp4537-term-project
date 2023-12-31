const USER_MESSAGES = {
    generalError: 'Something went wrong. Please try again later.',
    missingText: 'Missing text. Please provide text to summarize.',
    missingKeyword: 'Missing keyword in query. Please provide keyword to search for.',
    failedToSummarizeText: 'Failed to summarize text. Please try again later.',
    failedToRegisterUser: 'Failed to register. Please try again later.',
    news: {
        failedToGetTrendingNews: 'Failed to get trending news. Please try again later.',
        failedToSearchNews: 'Failed to search news. Please try again later.',
    },
    auth: {
        tokenNotFound: 'Token not found.',
        userQuotaExceeded: 'User quota exceeded.',
        errorValidatingToken: 'Error occurred when validating token.',
        notAdmin: 'Non-admin user is not allowed to access this resource.',
    },
    role: {
        roleNotFound: 'Role not found.',
    },
    login: {
        missingFields: 'Missing email, username or password.',
        invalid: 'Invalid login.',
        failure: 'Failed to login. Please try again later.',
        invalidEmail: 'Invalid email format.',
    },
    registration: {
        missingFields: 'Missing email, username or password.',
        failure: 'Failed to register. Please try again later.',
        success: 'User registered successfully.',
        invalidEmail: 'Invalid email format.',
    },
    wordBookmark: {
        missingFields: 'Missing word.',
        readFailure: 'Failed to retrieve words. Please try again later.',
        addSuccess: 'Word \'%s\' added successfully.',
        addFailure: 'Failed to add word. Please try again later.',
        editSuccess: 'Word \'%s\' edited to \'%s\' successfully.',
        editFailure: 'Failed to edit word. Please try again later.',
        deleteFailure: 'Failed to delete word. Please try again later.',
    },
};

module.exports = {
    USER_MESSAGES,
};