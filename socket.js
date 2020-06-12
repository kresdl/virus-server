'use strict';

const gameStream = require('./game-stream'),
  socketio = require('socket.io');

module.exports = http => {
  const io = socketio(http),

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
          players.forEach(p => users[p].emit('end', results))
          queue.push(...players);
          roll();
        });
      }
    };

  io.on('connection', socket => {

    socket.on('join', nick => {
      const user = sanitize(nick);

      socket.once('disconnect', () => {
        delete users[user];
        const i = queue.indexOf(user);
        if (i >= 0) queue.splice(i, 1);
      });

      if (users[user]) return socket.emit('inuse');

      users[user] = socket;
      queue.push(user);

      socket.emit('joined', user);
      roll();
    });
  });
}