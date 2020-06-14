'use strict';

require('dotenv').config();

const port = +process.env.PORT || 3000,
  http = require('./http'),
  { player$ } = require('./player'),
  game = require('./game');

player$.pipe(game).subscribe(player =>
  player$.next(player));

http.listen(port, '0.0.0.0', () => {
  console.log('Listening on port ' + port);
});