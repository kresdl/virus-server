'use strict';

require('dotenv').config();

const debug = require('debug')('virus-server'),
  port = +process.env.PORT || 3000,
  http = require('./http');

require('./main');

http.listen(port, 'localhost', () => {
  debug('Listening on port ' + port);
});