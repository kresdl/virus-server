'use strict';

require('dotenv').config();

const port = +process.env.PORT || 3000,
  http = require('./http'),
  game$ = require('./game-stream');

game$.subscribe();

http.listen(port, '0.0.0.0', () => {
  console.log('Listening on port ' + port);
});