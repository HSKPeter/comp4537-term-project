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

app.post(ROUTE_PATHS.REGISTER, );
app.post(ROUTE_PATHS.LOGIN, async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Check if the username exists
        const user = await runSQLQuery('SELECT * FROM User WHERE Name = ?', [username]);
        if (user.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user[0].Password);

        console.log('passwordMatch: ', passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username, password or email' });
        }

        // Compare the provided email with the email in the database
        const emailMatch = email === user[0].Email;

        console.log('emailMatch: ', emailMatch);

        if (!emailMatch) {
            return res.status(401).json({ error: 'Invalid username, password or email' });
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
        res.status(500).json({ error: 'Internal server error' });
    }
});

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

    // TODO: Read database to determine if the user has remaining quota
    if (apiCallCount > 20) {
        return false;
    }

    return true;
}

app.post(ROUTE_PATHS.USER, async (req, res) => {
    try {
        const { token } = req.body;

        const payload = decodeToken(token);

        if (!payload) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }

        const hasRemainingQuota = await checkIfUserHasRemainingQuota(token);
        const newToken = renewToken(payload);

        res.status(200).json({ hasRemainingQuota, newToken });
    } catch (error) {
        console.error('Error authenticating token: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post(ROUTE_PATHS.ROLE, async (req, res) => {
    try {
        const { token } = req.body;
        const payload = decodeToken(token);
        if (!payload) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
        const { role } = payload;
        const newToken = renewToken(payload);
        res.status(200).json({ role, newToken });
    } catch (error) {
        console.error('Error retrieving role: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post(ROUTE_PATHS.RECORD, async (req, res) => {
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

        res.status(201).json({ message: 'API call recorded successfully' });
    } catch (error) {
        console.error('Error recording API call: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get(ROUTE_PATHS.GET_BOOKMARK_WORDS, async (req, res) => {
    try {
        const {userID} = req.params;
        runSQLQuery('SELECT word FROM BookmarkWord WHERE UserID = ?', [userID])
        .then((wordsQueryResults) => {
            const words = wordsQueryResults.map((wordQueryResult) => wordQueryResult.word);
            // Set Cache-Control header to prevent caching
            res.setHeader('Cache-Control', 'no-store');
            res.status(200).json({ words });
        })
        .catch((err) => {
            console.error('Error retrieving bookmarked words: ', err);
            res.status(500).json({ error: 'Internal server error' });
        });
    } catch (error) {
        console.error('Error retrieving bookmarked words: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post(ROUTE_PATHS.POST_BOOKMARK_WORDS, async (req, res) => {
    try {
        const {userID} = req.params;
    
        const { word } = req.body;

        if (word.length === 0) {
            res.status(409).json({ error: 'Word is required' });
            return;
        }

        // Check if word exists in the database
        let wordExists = await runSQLQuery('SELECT * FROM BookmarkWord WHERE UserID = ? AND Word = ?', [userID, word]);
        if (wordExists.length > 0) {
            res.status(409).json({ error: `Word '${word}' already bookmarked` });
            return;
        }

        console.log(`Bookmarking word: ${word}`);

        runSQLQuery('INSERT INTO BookmarkWord (UserID, Word) VALUES (?, ?)', [userID, word])
            .catch((err) => {
                console.error('Error bookmarking word: ', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            });

        res.status(201).json({ message: `"${word}" bookmarked successfully` });
        
    } catch (error) {
        console.error('Error bookmarking word: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put(ROUTE_PATHS.PUT_BOOKMARK_WORDS, async (req, res) => {
    try {
        const {userID} = req.params;

        const { originalWord, newWord } = req.body;

        // Check if original word exists
        let wordExists = await runSQLQuery('SELECT * FROM BookmarkWord WHERE UserID = ? AND Word = ?', [userID, originalWord]);
        if (wordExists.length === 0) {
            res.status(400).json({ error: `Word '${originalWord}' not found` });
            return;
        }
    
        let rows = runSQLQuery('UPDATE BookmarkWord SET Word = ? WHERE UserID = ? AND Word = ?', [newWord, userID, originalWord])
            .then(() => {
                res.status(200).json({ message: 'Word updated successfully' });
            })
            .catch((err) => {
                console.error('Error updating bookmarked word: ', err);
                res.status(500).json({ error: 'Internal server error' });
            });
    } catch (error) {
        console.error('Error updating bookmarked word: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete(ROUTE_PATHS.DELETE_BOOKMARK_WORDS, async (req, res) => {
    try {
        const {userID} = req.params;

        const toDeleteAll = req.query.all === 'true';
    
        if (toDeleteAll) {
            runSQLQuery('DELETE FROM BookmarkWord WHERE UserID = ?', [userID])
            .then(() => {
                res.status(200).json({ message: 'All words deleted successfully' });
            })
            .catch((err) => {
                console.error('Error deleting all bookmarked words: ', err);
                res.status(500).json({ error: 'Internal server error' });
            });
            return;
        } 
    
        const { word } = req.body;

        // Check if the words array is empty
        if (!word) {
            res.status(400).json({ error: 'Received an empty string!' });
            return;
        }

        // Checks if the word exists in the database
        let wordExists = await runSQLQuery('SELECT * FROM BookmarkWord WHERE UserID = ? AND Word = ?', [userID, word]);
        if (wordExists.length === 0) {
            res.status(400).json({ error: `Word '${word}' not found` });
            return;
        }
        

        console.log(`Deleting word: ${word}`);

        // Delete the word from the database
        runSQLQuery('DELETE FROM BookmarkWord WHERE UserID = ? AND Word = ?', [userID, word])
            .catch((err) => {
                console.error('Error deleting bookmarked word: ', err);
                res.status(500).json({ error: 'Internal server error' });
            });

        // for (let i = 0; i < words.length; i++) {
        //     const word = words[i];
        //     let wordExists = await runSQLQuery('SELECT * FROM BookmarkWord WHERE UserID = ? AND Word = ?', [userID, word]);
        //     if (wordExists.length === 0) {
        //         res.status(400).json({ error: `Word '${word}' not found` });
        //         return;
        //     }

        //     console.log(`Deleting word: ${word}`)

        //     runSQLQuery('DELETE FROM BookmarkWord WHERE UserID = ? AND Word = ?', [userID, word])
        //         .catch((err) => {
        //             console.error('Error deleting bookmarked word: ', err);
        //             res.status(500).json({ error: 'Internal server error' });
        //         });
        // }

        res.status(200).json({ message: 'Words deleted successfully' });
    } catch (error) {
        console.error('Error deleting bookmarked word: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Admin API Endpoints

//Implement get API stats for admin
app.get(ROUTE_PATHS.API_STATS, async (req, res) => {
    try {
        // Fetch API stats
        const apiStats = await getApiStatsFromDatabase();

        // Return API stats
        res.status(200).json({ usageStats: apiStats });

    } catch (err) {
        console.error(`Failed to get API stats from the database: ${err?.stack ?? err}`);
        res.status(500).json({ error: 'Failed to fetch API stats from the database' });
    }
});

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

//Implement get API stats by user for admin
app.get(ROUTE_PATHS.USERS_INFO, async (req, res) => {
    try {
        // Fetch API stats
        const apiStats = await getApiStatsByUserFromDatabase();

        // Return API stats
        res.status(200).json({ usageStats: apiStats });

    } catch (err) {
        console.error(`Failed to get API stats from the database: ${err?.stack ?? err}`);
        res.status(500).json({ error: 'Failed to fetch API stats from the database' });
    }
});

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


// Implement get API consumption for user by admin
app.get(ROUTE_PATHS.API_CONSUMPTION, async (req, res) => {
    try {
        const { userID } = req.params;

        // Fetch API consumption stats for the specified user ID
        const apiStats = await getApiConsumptionForCurrentUser(userID);

        // Return API consumption stats
        res.status(200).json({ usageStats: apiStats });

    } catch (err) {
        console.error(`Failed to get API consumption stats from the database: ${err?.stack ?? err}`);
        res.status(500).json({ error: 'Failed to fetch API consumption stats from the database' });
    }
});

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


