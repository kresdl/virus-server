'use strict';

require('dotenv').config();

const debug = require('debug')('virus-server'),
  port = process.env.PORT || 3000,
  http = require('./http'),
  { join$, player$, game$ } = require('./observables'),
  { join, player } = require('./observers');

join$.subscribe(join);
player$.subscribe(player);
game$.subscribe();

http.listen(port, '0.0.0.0', () => {
  debug('Listening on port ' + port);
});