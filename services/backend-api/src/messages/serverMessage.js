const SERVER_MESSAGES = {
    portListening: 'Server listening on port %d in %s mode',
    swaggerDocs: 'Swagger docs available at %s',
    huggingFaceTokenNotSet: 'Hugging Face token not set',
    newsDataApiKeyNotSet: 'News Data API key not set',
    failedToSummarizeText: 'Failed to summarize text. %s',
    failedToGetNews: 'Failed to get news. %s',
    models: {
        useHfApi: 'Using Hugging Face API to summarize text',
        useSelfHostedModel: 'Using self-hosted model to summarize text',
        successHfApi: 'Successfully summarized text with Hugging Face API',
        successSelfHostedModel: 'Successfully summarized text with self-hosted model',
    },
};

module.exports = {
    SERVER_MESSAGES,
};