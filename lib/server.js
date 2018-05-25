const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const api = require('./api');

const PORT = process.env.PORT || 3000;

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', api);

app.get("*", (req, res) => {
  res.sendFile('index.html', {root: './dist'});
});

app.listen(PORT, () => {
  console.log(`Connected on port ${PORT}`);
});

