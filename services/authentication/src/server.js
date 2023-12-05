const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config({ path: './.env' });

require('./router/routes');
const { setupDatabase } = require('./utils/sqlUtil')
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
const { apiConsumptionController } = require('./controllers/apiConsumptionController');
const { swaggerSpecs } = require('./swagger/swaggerDocs');
const { ROUTE_PATHS } = require('./router/routes');

const app = express();

// Setup Swagger UI
app.use(ROUTE_PATHS.SWAGGER, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Enable CORS
app.use(cors());

// Enable body parsing for JSON and URL encoded data
app.use(express.json());

const PORT = 8000;

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
app.get(ROUTE_PATHS.API_STATS, apiStatsController);

//Implement get API stats by user for admin
app.get(ROUTE_PATHS.USERS_INFO, apiStatsByUserController);
 
// Implement get API consumption for user by admin
app.get(ROUTE_PATHS.API_CONSUMPTION, apiConsumptionController);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}${ROUTE_PATHS.SWAGGER}`);
    try {
        setupDatabase();
    } catch (error) {
        console.log(error);
    }
});
