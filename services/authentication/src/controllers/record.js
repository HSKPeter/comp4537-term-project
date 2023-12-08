const { runSQLQuery } = require('../utils/sqlUtil');
const { USER_STRINGS, formatUserString } = require('../utils/userStrings');

async function recordController(req, res) {
    try {
        const { token, endpoint, method, timestamp } = req.body;

        // Retrieve the user ID from the token
        const decodedToken = decodeToken(token);

        if (!decodedToken) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }

        // Extract user ID from the decoded token
        const userID = decodedToken.userID;

        // Extract Time from timestamp
        const time = new Date(timestamp);

        // Insert the API call into the database
        await runSQLQuery('INSERT INTO APICall (UserID, Time, Method, Endpoint) VALUES (?, ?, ?, ?)', [userID, time, method, endpoint]);

        res.status(201).json({ message: USER_STRINGS.API_CALL_RECORDED_SUCESSFULLY });
    } catch (error) {
        console.error('Error recording API call: ', error);
        res.status(500).json({ error: USER_STRINGS.SERVER_ERROR });
    }
};

function decodeToken(token) {
    try {
        const decodedToken = jwt.verify(token, SECRET_KEY);
        return decodedToken;
    } catch (error) {
        return null;
    }
}

module.exports = {
    recordController
}
