const express = require('express');
const cors = require('cors');
const { vsprintf } = require('sprintf-js');
const swaggerUi = require('swagger-ui-express');

const { PORT, MODE, HUGGINGFACE_API_TOKEN, BACKEND_ORIGIN } = require('./config');
const { ROUTE_PATHS } = require('./router/routes');
const { swaggerSpecs } = require('./router/swaggerDocs');
const { SERVER_MESSAGES } = require('./messages/serverMessage');
const { CORS_OPTIONS } = require('./utils/corsUtils');
const router = require('./router');

const app = express();

app.use(ROUTE_PATHS.SWAGGER, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Enable CORS
app.use(cors(CORS_OPTIONS));

// Enable body parsing for JSON and URL encoded data
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(ROUTE_PATHS.ROOT, router);

app.listen(PORT, () => {
  console.info(vsprintf(SERVER_MESSAGES.portListening, [PORT, MODE]));
  console.info(vsprintf(SERVER_MESSAGES.swaggerDocs, [BACKEND_ORIGIN + ROUTE_PATHS.SWAGGER]));

  if (HUGGINGFACE_API_TOKEN === undefined) {
    console.warn(SERVER_MESSAGES.huggingFaceTokenNotSet);
  }
});