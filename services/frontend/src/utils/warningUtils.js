function displayWarningIfExceedApiLimit(response) {
    const isApiLimitExceeded = response.headers['x-api-limit-exceeded'] === 'true';
    if (isApiLimitExceeded) {
        // TODO: Refactor user message into constants
        alert('You have exceeded the API limit, but we will still provide you with the service.');
    }
}

module.exports = {
    displayWarningIfExceedApiLimit
}