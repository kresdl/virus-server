'use strict';

require('dotenv').config();

const debug = require('debug')('virus-server'),
  port = +process.env.PORT || 3000,
  http = require('./http'),
  { join$, player$, game$, leave$ } = require('./observables'),
  { join, leave, player } = require('./observers');

join$.subscribe(join);
player$.subscribe(player);
leave$.subscribe(leave);
game$.subscribe();

http.listen(port, 'localhost', () => {
  debug('Listening on port ' + port);
});