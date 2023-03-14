const { config } = require('symeo-js');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: config.corsOrigin }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`);
});
