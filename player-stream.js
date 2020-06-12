'use strict';

const { fromEvent } = require('rxjs'),
  { map } = require('rxjs/operators'),

  escape = char => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;'
  })[char],

  sanitize = str => str && str.trim().replace(/[<>&'"]/g, escape),

  users = {},
  queue = [],

  roll = () => {
    while (queue.length >= 2) {
      const players = queue.splice(0, 2);

      gameStream(...players, users).subscribe(results => {
        const current = players.filter(p => users[p]);
        current.forEach(p =>
          users[p].emit('end', results)
        )
        queue.push(...current);
        roll();
      });
    }
  };

module.exports = {

  click: (player, sockets) => 
    fromEvent(sockets[player], 'click')
      .pipe(
        map(({ x, y }) => ({
          player, x, y,
          time: Date.now()
        }))
      ),
  
  disconnect: (player, sockets, queue) => 
    fromEvent(sockets[player], 'disconnect')
      .pipe(
        tap(() => {
          delete sockets[player];
          const i = queue.indexOf(user);
          if (i >= 0) queue.splice(i, 1);    
        })
      ),
  
  join: (sockets, socket, queue) => 
    fromEvent(socket, 'join')
      .pipe(
        tap(nick => {
          const user = sanitize(nick);      
          if (sockets[user]) return socket.emit('inuse');
      
          sockets[user] = socket;
          queue.push(user);
      
          socket.emit('joined', user);
        })
      )
};
