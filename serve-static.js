'use strict';

const express = require('express'),
  app = express();

app.use('/:nick', express.static('public'));

module.exports = app;