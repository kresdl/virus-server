'use strict';

require('dotenv').config();

const debug = require('debug')('virus-server'),
  port = +process.env.PORT || 3000,
  http = require('./http'),
  player$ = require('./player-stream'),
  play = require('./play');

player$.pipe(play).subscribe(player =>
  player$.next(player)
);

http.listen(port, '0.0.0.0', () => {
  debug('Listening on port ' + port);
});