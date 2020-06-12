'use strict';

const { fromEvent } = require('rxjs'),
  { map, tap } = require('rxjs/operators');

module.exports = (player, sockets) => 
  fromEvent(sockets[player], 'click')
    .pipe(
      map(({ x, y }) => ({
        player, x, y,
        time: Date.now()
      }))
    );