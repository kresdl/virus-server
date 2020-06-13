'use strict';

const serveStatic = require('./serve-static'),
  http = require('http').createServer(serveStatic);

module.exports = http;
