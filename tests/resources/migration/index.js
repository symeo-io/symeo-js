const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
