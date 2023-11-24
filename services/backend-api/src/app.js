const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const { ROUTE_PATHS } = require('./router/routes');
const { swaggerSpecs } = require('./router/swaggerDocs');
const { CORS_OPTIONS } = require('./utils/corsUtils');
const router = require('./router');
const { IS_DEVELOPMENT_MODE } = require('./config');

const app = express();

app.use(ROUTE_PATHS.SWAGGER, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Enable CORS
if (IS_DEVELOPMENT_MODE) {
    app.use(cors());
} else {
    app.use(cors(CORS_OPTIONS));
}

// Enable body parsing for JSON and URL encoded data
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(ROUTE_PATHS.ROOT, router);

module.exports = app;

