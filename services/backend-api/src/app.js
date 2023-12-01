const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const cookieParser = require('cookie-parser')

const { ROUTE_PATHS } = require('./router/routes');
const { swaggerSpecs } = require('./router/swaggerDocs');
const { CORS_OPTIONS } = require('./utils/corsUtils');
const router = require('./router');
const { logging } = require('./middlewares/logging');

const app = express();

app.use(ROUTE_PATHS.SWAGGER, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Enable CORS
app.use(cors(CORS_OPTIONS));

// Enable body parsing for JSON and URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable cookie parsing
app.use(cookieParser());

// Log all incoming requests
app.use(logging);

app.use(ROUTE_PATHS.ROOT, router);

module.exports = app;