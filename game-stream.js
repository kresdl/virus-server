'use strict';

const { SETS, VIRUS_SIZE, SCOPE_RADIUS, 
  GAME_DELAY, SET_DELAY, MAX_VIRUS_DELAY } = process.env,

  playerStream = require('./player-stream'),

  { of, merge, range } = require('rxjs'),

  { map, tap, toArray, concatMap, mergeMap,
    delay, skipWhile, take, timeoutWith } = require('rxjs/operators'),

  scatter = r => {
    const r2 = r * Math.sqrt(Math.random()),
      theta = Math.random() * 2 * Math.PI,
      x = r + r2 * Math.cos(theta),
      y = r + r2 * Math.sin(theta);
    return { x, y };
  };

module.exports = (p1, p2, sockets) => {

  const toPlayers = (type, data) => [p1, p2].forEach((p, i) => {
    const socket = sockets[p];
    socket && socket.emit(type, data)
  });

  return of(0).pipe(
    tap(() => toPlayers('ready', [p1, p2])),
    delay(GAME_DELAY),
    mergeMap(() =>
      range(0, SETS).pipe(
        concatMap(() =>
          of(0).pipe(
            tap(() => toPlayers('start')),
            delay(MAX_VIRUS_DELAY * Math.random()),
            map(() => ({
              ...scatter(+SCOPE_RADIUS),
              variant: Math.floor(3 * Math.random()),
              time: Date.now()
            })),
            tap(({ x, y, variant }) => toPlayers('virus', { x, y, variant })),
            mergeMap(virus =>
              merge(
                playerStream(p1, sockets),
                playerStream(p2, sockets)
              ).pipe(
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
                tap(results => toPlayers(results ? 'results' : 'miss', results)),
                delay(SET_DELAY)
              )
            )
          )
        )
      )
    ),
    toArray()
  )
};
