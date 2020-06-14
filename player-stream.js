'use strict';

const http = require('./http'),
  { Subject, fromEvent } = require('rxjs'),
  { take, tap } = require('rxjs/operators'),
  io = require('socket.io')(http),

  escape = char => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;'
  })[char],

  sanitize = str => str && str.trim().replace(/[<>&'"]/g, escape),

  players = new Set(),
  player$ = new Subject();

io.on('connection', socket => {
  socket.on('join', nick => {
    const name = sanitize(nick);

    if (players.has(name))
      return socket.emit('inuse');

    players.add(name);
    socket.emit('joined', name);

    const leave$ = fromEvent(socket, 'disconnect')
      .pipe(
        take(1),
        tap(() => players.delete(name)),
      );

    leave$.subscribe();

    player$.next({ name, socket, leave$ });
  });
});

module.exports = player$;
