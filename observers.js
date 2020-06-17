'use strict';

const { fromEvent} = require('rxjs'),
  { takeUntil, mapTo } = require('rxjs/operators'),
  { player$ } = require('./observables');

  // Escape unsafe characters
const escape = char => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;'
  })[char];

const sanitize = str => str && str.trim().replace(/[<>&'"]/g, escape);

const players = new Set();

// Creates a stream of play again-requests for specific player
const playAgain = socket =>
  fromEvent(socket, 'play-again')
    .pipe(
      takeUntil(
        fromEvent(socket, 'disconnect')
      )
    );

// Creates a disconnect stream
const leave = ({ name, socket }) =>
  fromEvent(socket, 'disconnect')
    .pipe(
      mapTo(name)
    );

// On login
const join = ({ nick, socket }) => {
  const name = sanitize(nick);

  if (players.has(name))
    return socket.emit('inuse');

  players.add(name);
  socket.emit('joined', name);

  const player = { name, socket },
    playAgain$ = playAgain(socket),
    leave$ = leave(player);

  // Respond to play again-requests by feeding player
  // back into stream
  playAgain$.subscribe(() => player$.next(player));

  // Respond to disconnects
  leave$.subscribe(() => players.delete(name));

  // Initial player feed
  player$.next(player);
};

// On validated
const player = ({ socket }) => {
  socket.emit('wait')
};

module.exports = { join, player };