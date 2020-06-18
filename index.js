'use strict';

require('dotenv').config();

const debug = require('debug')('virus-server'),
  port = process.env.PORT || 3000,
  http = require('./http'),
  { join$, game$ } = require('./observables'),
  { join } = require('./observers');

join$.subscribe(join);
game$.subscribe();

http.listen(port, '0.0.0.0', () => {
  debug('Listening on port ' + port);
});