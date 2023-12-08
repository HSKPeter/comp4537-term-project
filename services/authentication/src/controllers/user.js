const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const { runSQLQuery } = require('../utils/sqlUtil');
const { USER_STRINGS, formatUserString } = require('../utils/userStrings');

const DEFAULT_TOKEN_EXPIRES_IN = 60 * 15; // 15 minutes

async function userController(req, res) {
    try {
        const { token } = req.body;

        const payload = decodeToken(token);

        if (!payload) {
            res.status(401).json({ error: USER_STRINGS.INVALID_TOKEN });
            return;
        }

        const hasRemainingQuota = await checkIfUserHasRemainingQuota(token);
        const newToken = renewToken(payload);

        res.status(200).json({ hasRemainingQuota, newToken });
    } catch (error) {
        console.error('Error authenticating token: ', error);
        res.status(500).json({ error: USER_STRINGS.SERVER_ERROR });
    }
}

function decodeToken(token) {
    try {
        const decodedToken = jwt.verify(token, SECRET_KEY);
        return decodedToken;
    } catch (error) {
        return null;
    }
}

async function checkIfUserHasRemainingQuota(token) {
    const decodedToken = decodeToken(token);
    const userID = decodedToken.userID;
    const sqlQueryResult = await runSQLQuery('SELECT COUNT(*) AS callCount FROM APICall WHERE UserID = ?', [userID]);
    
    // Extract the call count from the query result
    const apiCallCount = sqlQueryResult[0].callCount;

    if (apiCallCount > 20) {
        return false;
    }

    return true;
}

function renewToken(payload) {
    const { iat, exp, expiresIn, ...corePayload } = payload;
    const newToken = jwt.sign(corePayload, SECRET_KEY, { expiresIn: DEFAULT_TOKEN_EXPIRES_IN });
    return newToken;
}

module.exports = {
    userController
}
