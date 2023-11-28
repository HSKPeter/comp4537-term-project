const jwt = require('jsonwebtoken');

// TODO: Call the auth server to validate the token
async function getRoleFromToken(jwtToken) {
    const payload = jwt.decode(jwtToken);
    const { role } = payload;
    if (role === undefined) {
        throw new Error("Invalid token");
    }

    return role;
}

module.exports = {
    getRoleFromToken
}