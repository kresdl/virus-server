'use strict';

const expressApp = require('./static'),
  http = require('http').createServer(expressApp);

module.exports = http;
