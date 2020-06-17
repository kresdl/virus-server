'use strict';

const { Subject, fromEvent, of, range, from } = require('rxjs'),
  { map, toArray, concatMap, mergeMap, mergeAll, bufferCount,
    takeUntil, delay, take, timeoutWith, tap } = require('rxjs/operators'),

  SETS = 2,
  SCOPE_RADIUS = 300,
  SET_DELAY = 1000,
  VIRUS_TIME = 2000,
  MAX_VIRUS_INTERVAL = 4000,
  GAME_DELAY = 2000,

  http = require('./http'),
  io = require('socket.io')(http),

  // Generates a random point on a disc
  scatter = r => {
    const r2 = r * Math.sqrt(Math.random()),
      theta = Math.random() * 2 * Math.PI,
      x = r + r2 * Math.cos(theta),
      y = r + r2 * Math.sin(theta);
    return { x, y };
  },

  // Emit to player pair
  toPlayers = (players, type, data) => players.forEach(({ socket }) => {
    socket.connected && socket.emit(type, data);
  }),

  // Creates a stream of hit for specific player
  hit = ({ name, socket }) =>
    fromEvent(socket, 'click')
      .pipe(
        map(time => ({
          player: name,
          time
        })),
        takeUntil(
          fromEvent(socket, 'disconnect')
        )
      );

// Join stream (unvalidated nick)
const join$ = fromEvent(io, 'connection').pipe(
  mergeMap(socket =>
    fromEvent(socket, 'join').pipe(
      map(nick => ({ nick, socket }))
    )
  )
);

// Player stream (validated nick)
const player$ = new Subject();

// Game stream
const game$ = player$.pipe(
  // Pair players
  bufferCount(2),
  // Notify players of contender
  tap(players => players.forEach(({ name, socket }) =>
    socket.connected && socket.emit('ready', players.find(p =>
      p.name !== name).name))
  ),
  delay(GAME_DELAY),
  mergeMap(players =>
    // Run n sets
    range(0, SETS).pipe(
      concatMap(() =>
        of(0).pipe(
          // Start
          tap(() => toPlayers(players, 'start')),
          delay(MAX_VIRUS_INTERVAL * Math.random()),
          map(() => ({
            ...scatter(SCOPE_RADIUS),
            variant: Math.floor(3 * Math.random())
          })),

          // Emit virus
          tap(({ x, y, variant }) => toPlayers(players,
            'virus', { x, y, variant })
          ),
          mergeMap(() =>
            // Respond to hits
            from(players).pipe(
              map(hit),
              mergeAll(),
              timeoutWith(
                VIRUS_TIME, of(null)
              ),
              take(1),
              // Notify of set result
              tap(results => toPlayers(players,
                results ? 'partial' : 'miss', results)
              ),
              delay(SET_DELAY)
            )
          )
        )
      ),
      toArray(),
      // Notify of game results
      tap(results => toPlayers(players, 'results', results))
    )
  )
);

module.exports = {
  game$, join$, player$
};
