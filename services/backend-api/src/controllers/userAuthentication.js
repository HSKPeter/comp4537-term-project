const { USER_MESSAGES } = require('../messages/userMessage');
const { HTTP_STATUS_CODES } = require('../utils/httpUtils');
const { getHash, getToken } = require('../utils/userAuthenticationUtils');

async function userAuthenticationController(req, res) {
    // TODO: Catch internal server errors

    const { username, password } = req.body;

    // Demo user with hashed password
    const demoUser = {
      username: 'testuser',
      passwordHash: 'password_hash' // Example hash for "password"
    };
  
    // Hash the received password
    const hashedPassword = getHash(password)

    // Compare hashed password with stored hash
    if (username === demoUser.username && hashedPassword === demoUser.passwordHash) {
      const token = getToken() // Replace with actual token generation logic
      res.json({ token });
    } else {
      res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ message: USER_MESSAGES.invalidCredentials });
    }
}

module.exports = {
  userAuthenticationController
}