const { vsprintf } = require('sprintf-js');

const { PORT, MODE, HUGGINGFACE_API_TOKEN, NEWS_DATA_API_KEY } = require('./config');
const { SERVER_MESSAGES } = require('./messages/serverMessage');
const app = require('./app');

app.listen(PORT, () => {
  const message = vsprintf(SERVER_MESSAGES.portListening, [PORT, MODE]);
  console.log(message);

  if (HUGGINGFACE_API_TOKEN === undefined) {
    console.warn(SERVER_MESSAGES.huggingFaceTokenNotSet);
  }

  if (NEWS_DATA_API_KEY === undefined) {
    console.warn(SERVER_MESSAGES.newsDataApiKeyNotSet);
  }
});