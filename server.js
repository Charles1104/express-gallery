/*jshint esversion: 6 */

const express = require('express');
const app = express();

const db = require('./models');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  db.sequelize.sync();
});
