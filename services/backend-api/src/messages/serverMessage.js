const SERVER_MESSAGES = {
    portListening: 'Server listening on port %d in %s mode',
    swaggerDocs: 'Swagger docs available at %s',
    corsNotAllowed: 'CORS not allowed',
    huggingFaceTokenNotSet: 'Hugging Face token not set',
    requestReceived: '%s request received for %s',
    newsDataApiKeyNotSet: 'News Data API key not set',
    failedToSummarizeText: 'Failed to summarize text. %s',
    failedToRegisterUser: 'Failed to register user. %s',
    failedToLoginUser: 'Failed to login user. %s',
    failedToGetQuotaFromToken: 'Failed to get quota from token. %s',
    accessDenied: 'Access denied',
    recordedApiUsage: {
        success: 'Recorded API usage for %s request to %s',
        error: 'Error recording API usage for %s request to %s',
    },
    news: {
        failedToSearchNews: 'Failed to get news. %s',
        failedToGetTrendingNews: 'Failed to get trending news. %s',
    },
    models: {
        useHfApi: 'Using Hugging Face API to summarize text',
        useSelfHostedModel: 'Using self-hosted model to summarize text',
        successHfApi: 'Successfully summarized text with Hugging Face API',
        successSelfHostedModel: 'Successfully summarized text with self-hosted model',
        errorSelfHostedModel: 'Error using self-hosted model. %s',
        selfHostedNotAvailableInDev: 'Self-hosted model not available in development mode',
    },
    callingAuthServer: {
        unknownError: 'Unknown error occurred when calling auth server',
    },
    failedToRetrieveRoleFromToken: 'Failed to retrieve role from token. %s',
    failedToGetApiStats: 'Failed to get API statistics. %s',
    failedToGetApiStatsByUser: 'Failed to get API statistics by user. %s',
    failedToGetApiConsumptionStats: 'Failed to get API consumption statistics. %s',
};

module.exports = {
    SERVER_MESSAGES,
};