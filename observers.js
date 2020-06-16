const { playAgain } = require('./input'),
  { player$ } = require('./observables');

  // Escape unsafe characters
  escape = char => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;'
  })[char],

  sanitize = str => str && str.trim().replace(/[<>&'"]/g, escape),

  players = new Set();

// On login
const join = ({ nick, socket }) => {
  const name = sanitize(nick);

  if (players.has(name))
    return socket.emit('inuse');

  players.add(name);
  socket.emit('joined', name);

  const playAgain$ = playAgain(socket),
    player = { name, socket };

  // Respond to play again-requests by feeding player
  // back into stream
  playAgain$.subscribe(() => player$.next(player));

  // Initial player feed
  player$.next(player);
};

// On validated
const player = ({ socket }) => {
  socket.emit('wait')
};

// On disconnect
const leave = name => {
  delete players[name];
};

module.exports = { join, player, leave };