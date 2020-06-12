'use strict';

const gameStream = require('./game-stream'),
  socketio = require('socket.io');

module.exports = http => {
  const io = socketio(http);

  io.on('connection', socket => {

  });
}