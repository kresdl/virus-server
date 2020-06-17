const { fromEvent } = require('rxjs'),
  { map, takeUntil, mapTo } = require('rxjs/operators');

// Creates a stream of mouse clicks for specific player
const click = ({ name, socket }) =>
  fromEvent(socket, 'click')
    .pipe(
      map(({ x, y }) => ({
        player: name,
        time: Date.now(),
        x, y,
      })),
      takeUntil(
        fromEvent(socket, 'disconnect')
      )
    );

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

module.exports = { click, playAgain, leave };

