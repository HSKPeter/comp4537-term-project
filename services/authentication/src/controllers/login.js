const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const { runSQLQuery } = require('../utils/sqlUtil');
const { USER_STRINGS, formatUserString } = require('../utils/userStrings');

const DEFAULT_TOKEN_EXPIRES_IN = 60 * 15; // 15 minutes

async function loginController(req, res)  {
    try {
        const { email, username, password } = req.body;

        // Check if the username exists
        const user = await runSQLQuery('SELECT * FROM User WHERE Name = ?', [username]);
        if (user.length === 0) {
            return res.status(401).json({ error: USER_STRINGS.INVALID_LOGIN });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user[0].Password);

        console.log('passwordMatch: ', passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({ error: USER_STRINGS.INVALID_LOGIN_CREDENTIALS });
        }

        // Compare the provided email with the email in the database
        const emailMatch = email === user[0].Email;

        console.log('emailMatch: ', emailMatch);

        if (!emailMatch) {
            return res.status(401).json({ error: USER_STRINGS.INVALID_LOGIN_CREDENTIALS });
        }

        // Obtain the user type from the database        
        let queryResult = await runSQLQuery(`
            SELECT UserAuthorization 
            FROM UserType 
            WHERE UserTypeID = (
                SELECT UserType AS SelectedUserType 
                FROM User 
                WHERE Name = ?
            )`,
            [username]
        );
        
        const role = queryResult[0].UserAuthorization;

        // Sign a JWT token
        const token = jwt.sign({ userID: user[0].UserID, username: user[0].Name, role }, SECRET_KEY, { expiresIn: DEFAULT_TOKEN_EXPIRES_IN });

        res.status(200).json({ token, role });
    } catch (error) {
        console.error('Error logging in: ', error);
        res.status(500).json({ error: USER_STRINGS.SERVER_ERROR });
    }
}

module.exports = {
    loginController
}
