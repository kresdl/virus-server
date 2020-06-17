const { playAgain, leave } = require('./player'),
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