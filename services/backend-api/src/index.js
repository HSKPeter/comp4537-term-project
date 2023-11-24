const app = require('./app');
const { vsprintf } = require('sprintf-js');
const { PORT, MODE, HUGGINGFACE_API_TOKEN, NEWS_DATA_API_KEY, BACKEND_ORIGIN } = require('./config');
const { ROUTE_PATHS } = require('./router/routes');
const { SERVER_MESSAGES } = require('./messages/serverMessage');


app.listen(PORT, () => {
  console.info(vsprintf(SERVER_MESSAGES.portListening, [PORT, MODE]));
  console.info(vsprintf(SERVER_MESSAGES.swaggerDocs, [BACKEND_ORIGIN + ROUTE_PATHS.SWAGGER]));

  if (HUGGINGFACE_API_TOKEN === undefined) {
    console.warn(SERVER_MESSAGES.huggingFaceTokenNotSet);
  }

  if (NEWS_DATA_API_KEY === undefined) {
    console.warn(SERVER_MESSAGES.newsDataApiKeyNotSet);
  }
});