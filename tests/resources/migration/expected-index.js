const { config: symeoConfig } = require('symeo-js');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: symeoConfig.corsOrigin }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(symeoConfig.port, () => {
  console.log(`Example app listening on port ${symeoConfig.port}`);
});
