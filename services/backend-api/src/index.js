const express = require('express');

const app = express();
const PORT = 8080;

app.get('/', async (req, res) => {
  res.json({ "message": "Hello World!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});