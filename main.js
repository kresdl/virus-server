'use strict';

const { Subject, fromEvent, of, range, from, interval, merge } = require('rxjs'),

  { map, toArray, concatMap, mergeMap, takeUntil, mergeAll,
    delay, skipWhile, take, timeoutWith, bufferCount, mapTo,
    tap, defaultIfEmpty, withLatestFrom, expand } = require('rxjs/operators'),

  SETS = 10,
  VIRUS_SIZE = 100,
  SCOPE_RADIUS = 300,
  SET_DELAY = 1000,
  VIRUS_TIME = 2000,
  MAX_VIRUS_INTERVAL = 4000,

  http = require('./http'),
  io = require('socket.io')(http),
  debug = require('debug')('virus-server:main'),

  // Escape unsafe characters
  escape = char => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;'
  })[char],

  sanitize = str => str && str.trim().replace(/[<>&'"]/g, escape),

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

  players = new Set();

const join$ = fromEvent(io, 'connection').pipe(
  mergeMap(socket =>
    fromEvent(socket, 'join').pipe(
      map(nick => ({ nick, socket }))
    )
  )
);

const player$ = new Subject();

join$.subscribe(({ nick, socket }) => {
  const name = sanitize(nick);

  if (players.has(name))
    return socket.emit('inuse');

  players.add(name);
  socket.emit('joined', name);

  player$.next({ name, socket });
});

player$.subscribe(({ socket }) => {
  socket.emit('wait')
});

const pair$ = player$.pipe(
  bufferCount(2)
);

pair$.subscribe(players =>
  players.forEach(({ name, socket }) =>
    socket.connected && socket.emit('ready', players.find(p =>
      p.name !== name).name)));

const game$ = pair$.pipe(
  delay(SET_DELAY)
);

game$.subscribe(players => {
  toPlayers(players, 'start');

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
            variant: Math.floor(3 * Math.random()),
            time: Date.now()
          })),

          // Emit virus
          tap(({ x, y, variant }) => toPlayers(players,
            'virus', { x, y, variant })
          ),
          mergeMap(virus =>

            // Respond to clicks
            from(players).pipe(
              map(click),
              mergeAll(),
              skipWhile(player => {
                const d = Math.sqrt((virus.x - player.x) ** 2
                  + (virus.y - player.y) ** 2);
                return d > VIRUS_SIZE / 2;
              }),
              timeoutWith(
                2000, of(null)
              ),
              take(1),
              map(p =>
                p && {
                  player: p.player,
                  time: p.time - virus.time
                }
              ),

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
      tap(results => toPlayers(players, 'results', results)),

      // Respond to play again-requests by emitting them 
      // for subscriber to feed them back in again
      mergeMap(() =>
        from(players).pipe(
          map(playAgain),
          mergeAll()
        )
      )
    )
  )
});

const disconnect$ = join$.pipe(
  mergeMap(player =>
    fromEvent(player.socket, 'disconnect').pipe(
      mapTo(player.name)
    )
  )
);

disconnect$.subscribe(name => {
  delete players[name];
});