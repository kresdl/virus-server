'use strict';

const static = require('./static'),
  http = require('http').createServer(static);

module.exports = http;
