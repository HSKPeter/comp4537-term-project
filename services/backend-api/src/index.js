const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { vsprintf } = require('sprintf-js');
const swaggerUi = require('swagger-ui-express');

const { PORT, MODE, HUGGINGFACE_API_TOKEN } = require('./config');
const { ROUTE_PATHS } = require('./router/routes');
const { swaggerSpecs } = require('./router/swaggerDocs');
const { SERVER_MESSAGES } = require('./messages/serverMessage');
const { CORS_OPTIONS } = require('./utils/corsUtils');
const router = require('./router');

const app = express();

app.use(ROUTE_PATHS.SWAGGER, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Enable CORS
app.use(cors(CORS_OPTIONS));

// Enable body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(ROUTE_PATHS.ROOT, router);

app.listen(PORT, () => {
  const message = vsprintf(SERVER_MESSAGES.portListening, [PORT, MODE]);
  console.log(message);

  if (HUGGINGFACE_API_TOKEN === undefined) {
    console.warn(SERVER_MESSAGES.huggingFaceTokenNotSet);
  }
});