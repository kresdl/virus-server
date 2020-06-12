'use strict';

const http = require('./http'),
  { Observable, fromEvent, Observable } = require('rxjs'),
  { map, take, takeUntil } = require('rxjs/operators'),
  io = require('socket.io')(http),

  escape = char => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;'
  })[char],

  sanitize = str => str && str.trim().replace(/[<>&'"]/g, escape),

  players = new Set();

  player$ = new Observable(subscriber => {
    io.on('connection', socket => {
      socket.on('join', nick => {
        const name = sanitize(nick);

        if (players.has(name)) 
          return socket.emit('inuse');

        players.add(name);

        const leave$ = fromEvent(socket, 'disconnect')
          .pipe(
            take(1),
            tap(() => players.delete(name)),
          );
  
        subscriber.next({ name, socket, leave$ });
      });
    })
  }),

  fromClick = player =>
    fromEvent(player.socket, 'click')
      .pipe(
        map(({ x, y }) => ({
          player, x, y,
          time: Date.now()
        })),
        takeUntil(player.leave$)
      )
  
module.exports = { player$, fromClick }
