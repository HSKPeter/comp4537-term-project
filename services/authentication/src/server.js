const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config({ path: './.env' });

require('./router/routes');
const { runSQLQuery, setupDatabase } = require('./utils/sqlUtil')
const { registerController } = require('./controllers/register');
const { loginController } = require('./controllers/login');
const { userController } = require('./controllers/user');
const { roleController } = require('./controllers/role');
const { recordController } = require('./controllers/record');
const { 
    getBookmarkWordController, 
    postBookmarkWordController,  
    putBookmarkWordController,
    deleteBookmarkWordController
} = require('./controllers/bookmarkWords');
const { apiStatsController } = require('./controllers/apiStats');
const { apiStatsByUserController } = require('./controllers/apiStatsByUser');
const { usersInfoController } = require('./controllers/usersInfo');
const { swaggerSpecs } = require('./swagger/swaggerDocs');
const { ROUTE_PATHS } = require('./router/routes');

const DEFAULT_TOKEN_EXPIRES_IN = 60 * 15; // 15 minutes

const app = express();

// Setup Swagger UI
app.use(ROUTE_PATHS.SWAGGER, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Enable CORS
app.use(cors());

// Enable body parsing for JSON and URL encoded data
app.use(express.json());

const PORT = 8000;
const SECRET_KEY = process.env.JWT_SECRET_KEY;

// TODO: Remove 'abcd' from the below line
// const API_SECRET_KEY = process.env.API_SECRET_KEY ?? 'abcd';

// const BEARER_TOKEN_PREFIX = 'Bearer ';
// app.use((req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader) {
//             res.status(401).json({ error: 'No token provided' });
//             return;
//         }

//         if (!authHeader.startsWith(BEARER_TOKEN_PREFIX)) {
//             res.status(401).json({ error: 'Invalid token' });
//             return;
//         }

//         const apiKey = authHeader.substring(BEARER_TOKEN_PREFIX.length);

//         // TODO: Find the API key in the database
//         if (apiKey !== API_SECRET_KEY) {
//             res.status(401).json({ error: 'Invalid token' });
//             return;
//         }

//         next();
//     } catch (error) {
//         console.error('Error authenticating token: ', error);
//         res.status(401).json({ error: 'Invalid token' });
//     }
// });

function renewToken(payload) {
    const { iat, exp, expiresIn, ...corePayload } = payload;
    const newToken = jwt.sign(corePayload, SECRET_KEY, { expiresIn: DEFAULT_TOKEN_EXPIRES_IN });
    return newToken;
}

app.use((req, res, next) => {
    const method = req.method;
    const url = req.url;
    console.log(`[${method}] ${url}`);
    next();
})

app.post(ROUTE_PATHS.REGISTER, registerController);
app.post(ROUTE_PATHS.LOGIN, loginController);
app.post(ROUTE_PATHS.USER, userController);
app.post(ROUTE_PATHS.ROLE, roleController);
app.post(ROUTE_PATHS.RECORD, recordController);

app.get(ROUTE_PATHS.GET_BOOKMARK_WORDS, getBookmarkWordController);
app.post(ROUTE_PATHS.POST_BOOKMARK_WORDS, postBookmarkWordController); 
app.put(ROUTE_PATHS.PUT_BOOKMARK_WORDS, putBookmarkWordController);
app.delete(ROUTE_PATHS.DELETE_BOOKMARK_WORDS, deleteBookmarkWordController); 

//Implement get API stats for admin
app.get(ROUTE_PATHS.API_STATS, apiConsumptionController);

//Implement get API stats by user for admin
app.get(ROUTE_PATHS.USERS_INFO, usersInfoController);
 
// Implement get API consumption for user by admin
app.get(ROUTE_PATHS.API_CONSUMPTION, apiStatsByUserController);
function decodeToken(token) {
    try {
        const decodedToken = jwt.verify(token, SECRET_KEY);
        return decodedToken;
    } catch (error) {
        return null;
    }
}

async function getApiConsumptionForCurrentUser(userID) {
    try {
        const apiConsumptionQuery = `
            SELECT
                Endpoint AS 'api-name',
                Method AS 'request-type',
                COUNT(*) AS 'count'
            FROM APICall
            WHERE UserID = ?
            GROUP BY Method, Endpoint;
        `;

        const apiConsumption = await runSQLQuery(apiConsumptionQuery, [userID]);

        // Transform the result to the desired format
        const formattedApiConsumption = apiConsumption.map(apiStat => ({
            'api-name': apiStat['api-name'],
            'request-type': apiStat['request-type'],
            'count': apiStat['count']
        }));

        return formattedApiConsumption;
    } catch (error) {
        console.error('Error getting API consumption for the specified user from the database: ', error);
        throw error;
    }
}


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}${ROUTE_PATHS.SWAGGER}`);
    try {
        setupDatabase();
    } catch (error) {
        console.log(error);
    }
});


async function checkIfUserHasRemainingQuota(token) {
    const decodedToken = decodeToken(token);
    const userID = decodedToken.userID;
    const sqlQueryResult = await runSQLQuery('SELECT COUNT(*) AS callCount FROM APICall WHERE UserID = ?', [userID]);
    
    // Extract the call count from the query result
    const apiCallCount = sqlQueryResult[0].callCount;

    // TODO: Read database to determine if the user has remaining quota
    if (apiCallCount > 20) {
        return false;
    }

    return true;
}
async function getApiStatsByUserFromDatabase() {
    try {
        const apiStatsByUserQuery = `
            SELECT
                User.Name AS 'username',
                User.Email AS 'email',
                UserType.UserAuthorization AS 'role',
                COUNT(*) AS 'apiConsumption'
            FROM APICall
            JOIN User ON APICall.UserID = User.UserID
            JOIN UserType ON User.UserType = UserType.UserTypeID
            GROUP BY User.Name, User.Email, UserType.UserAuthorization;
        `;

        const apiStatsByUser = await runSQLQuery(apiStatsByUserQuery);

        // Transform the result to the desired format
        const formattedApiStats = apiStatsByUser.map(apiStat => ({
            username: apiStat.username,
            email: apiStat.email,
            role: apiStat.role,
            apiConsumption: apiStat.apiConsumption
        }));

        return formattedApiStats;
    } catch (error) {
        console.error('Error getting API stats by user from the database: ', error);
        throw error;
    }
}
async function getApiStatsFromDatabase() {
    try {
        // Query the database to get API stats
        const apiStatsQuery = `
            SELECT
                Endpoint AS 'api-name',
                Method AS 'request-type',
                COUNT(*) AS 'count'
            FROM APICall
            GROUP BY Method, Endpoint;
        `;

        const apiStats = await runSQLQuery(apiStatsQuery);

        return apiStats;
    } catch (error) {
        console.error('Error getting API stats from the database: ', error);
        throw error;
    }
}