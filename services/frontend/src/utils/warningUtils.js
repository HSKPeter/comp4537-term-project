import { USER_MESSAGES_EN } from './userMessages.js';

export function displayWarningIfExceedApiLimit(response) {
    const isApiLimitExceeded = response.headers['x-api-limit-exceeded'] === 'true';
    if (isApiLimitExceeded) {
        alert(USER_MESSAGES_EN.warning_utils_api_limit_exceeded);
    }
}