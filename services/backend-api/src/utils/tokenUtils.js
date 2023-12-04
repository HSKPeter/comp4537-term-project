const jwt = require('jsonwebtoken');

function readUserId(jwtToken) {
    const decodedToken = jwt.decode(jwtToken);

    if (!decodedToken) {
        return null;
    }

    return decodedToken.userID;
}

function readRole(jwtToken) {
    const decodedToken = jwt.decode(jwtToken);

    if (!decodedToken) {
        return null;
    }
    
    return decodedToken.role;
}

module.exports = {
    readUserId,
    readRole
};