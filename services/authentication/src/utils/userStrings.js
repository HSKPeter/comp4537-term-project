const USER_STRINGS = {
    NO_TOKEN: "No token provided",
    INVALID_TOKEN: "Invalid token",
    FAILED_TO_FETCH: "Failed to fetch API stats from the database",
    SERVER_ERROR: "Internal server error",
    WORD_REQUIRED: "Word is required",
    ALREADY_BOOKMARKED: "Word %s already bookmarked",
    BOOKMARKED_SUCCESSFULLY: "%s bookmarked successfully",
    WORD_NOT_FOUND: "Word %s not found",
    WORD_UPDATED_SUCESSFULLY: "Word updated successfully",
    WORDS_DELETED_SUCCESSFULLY: "All words deleted successfully",
    EMPTY_STRING: "Received an empty string!",
    INVALID_LOGIN: "Invalid username or password",
    INVALID_LOGIN_CREDENTIALS: "Invalid username, password or email",
    API_CALL_RECORDED_SUCESSFULLY: "API call recorded successfully",
    USERNAME_EXISTS: "Username already exists",
    USER_REGISTERED_SUCCESSFULLY: "User registered successfully",
    DELETED_WORD_SUCCESSFULLY: "Deleted '%s' successfully"
};

function formatUserString(userString, replacements) {
    if (!userString) {
        return "Empty user string";
    }

    let formattedString = userString;

    if (replacements && replacements.length > 0) {
        replacements.forEach((replacement) => {
            formattedString = formattedString.replace('%s', replacement);
        });
    }

    return formattedString;
}

module.exports = {
    USER_STRINGS,
    formatUserString
}