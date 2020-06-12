'use strict';

require('dotenv').config();

const port = +process.process.PORT || 3000,
  express = require('express'),
  socket = require('./socket'),
  app = express(),
  http = require('http').createServer(app);

socket(http);

app.use('/:nick', express.static('public'));

http.listen(port, '0.0.0.0', () => {
  console.log('Listening on port ' + port);
});