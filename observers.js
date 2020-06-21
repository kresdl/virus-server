'use strict';

const { fromEvent } = require('rxjs'),
  { takeUntil } = require('rxjs/operators'),
  { players$ } = require('./observables');

// Escape unsafe characters
const escape = char => ({
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  "'": '&apos;',
  '"': '&quot;'
})[char];

const sanitize = str => str && str.trim().replace(/[<>&'"]/g, escape);

// All players
const pool = new Set();

// Attempt to couple
const play = player => {
  const contender = uneven;
  if (contender) {
    uneven = null;
    players$.next([player, contender]);
  } else {
    uneven = player;
    player.socket.emit('wait');
  }
};

// Player waiting to be paired
let uneven;

// On login
const join = ({ nick, socket }) => {
  const name = sanitize(nick);

  if (pool.has(name))
    return socket.emit('inuse');

  pool.add(name);
  socket.emit('join', name);

  const player = { name, socket };

  // Create a disconnect-stream
  const leave$ = fromEvent(socket, 'disconnect')

  // Create a stream of play again-requests
  const playAgain$ = fromEvent(socket, 'play-again')
    .pipe(
      takeUntil(leave$)
    );

  // Respond to play again-requests
  playAgain$.subscribe(() => play(player));

  // Respond to disconnects
  leave$.subscribe(() => {
    pool.delete(name);
    if (uneven === player)
      uneven = null;
  });

  // Initial player feed
  play(player);
};

module.exports = { join };