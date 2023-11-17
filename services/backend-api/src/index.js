const express = require('express');
const { vsprintf } = require('sprintf-js');
const { PORT } = require('./config');
const { API_ROUTES } = require('./api/routes');
const { ROUTE_HANDLERS } = require('./api/routeHandlers');
const { SERVER_MESSAGES } = require('./messages/serverMessage');

const app = express();

app.get(API_ROUTES.ROOT, ROUTE_HANDLERS.root);

app.post(API_ROUTES.SUMMARIZE, ROUTE_HANDLERS.summarize);

app.listen(PORT, () => {
  const message = vsprintf(SERVER_MESSAGES.portListening, [PORT]);
  console.log(message);
});