'use strict';

const http = require('./http'),
  { Observable, fromEvent } = require('rxjs'),
  { map, take, takeUntil, tap } = require('rxjs/operators'),
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

  player$ = new Observable(subscriber => {
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

        const leaveSub = leave$.subscribe();
  
        subscriber.next({ name, socket, leave$ });

        return () => leaveSub.unsubscribe();
      });
    })
  }),

  fromClick = player =>
    fromEvent(player.socket, 'click')
      .pipe(
        map(({ x, y }) => ({
          player: player.name, 
          time: Date.now(),
          x, y,
        })),
        takeUntil(player.leave$)
      );
  
module.exports = { player$, fromClick }
