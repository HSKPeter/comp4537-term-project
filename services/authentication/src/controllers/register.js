const { runSQLQuery, UserTypes } = require('../utils/sqlUtil');

async function registerController(req, res)  {
    try {
        const { email, username, password } = req.body;

        // Check if the username already exists
        const userExists = await runSQLQuery(`SELECT * FROM User WHERE Name = ?`, [username]);

        if (userExists.length > 0) {
            return res.status(500).json({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        await runSQLQuery('INSERT INTO User (Name, Password, UserType, Email) VALUES (?, ?, ?, ?)', [username, hashedPassword, UserTypes.Regular, email]);

        // Select the user from the database
        const user = await runSQLQuery('SELECT * FROM User WHERE Name = ?', [username]);

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

        const token = jwt.sign({ userID: user[0].UserID, username: user[0].Name, role }, SECRET_KEY, { expiresIn: DEFAULT_TOKEN_EXPIRES_IN });
        res.status(201).json({ message: 'User registered successfully', token, role });
    } catch (error) {
        console.error('Error registering user: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    registerController
}
