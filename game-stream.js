'use strict';

const { env } = process,
  SETS = +env.SETS,
  VIRUS_SIZE = +env.VIRUS_SIZE,
  BOARD_SIZE = +env.BOARD_SIZE,
  GAME_DELAY = +env.GAME_DELAY,
  SET_DELAY = +env.SET_DELAY,
  MAX_VIRUS_DELAY = +env.MAX_VIRUS_DELAY,

  playerStream = require('./player-stream'),

  { of, merge, range } = require('rxjs'),

  { map, tap, toArray, concatMap, mergeMap,
    delay, takeLast, takeWhile } = require('rxjs/operators'),

  random = max => Math.floor(max * Math.random());

module.exports = (p1, p2, sockets) => {

  const toPlayers = (type, data) => [p1, p2].forEach(p =>
    sockets[p].emit(type, data)
  );

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
              x: random(BOARD_SIZE),
              y: random(BOARD_SIZE),
              variant: random(3),
              time: Date.now()
            })),
            tap(({ x, y, variant }) => toPlayers('virus', { x, y, variant })),
            mergeMap(virus =>
              merge(
                playerStream(p1, sockets),
                playerStream(p2, sockets)
              ).pipe(
                takeWhile(player => {
                  const d = Math.sqrt((virus.x - player.x) ** 2 
                  + (virus.y - player.y) ** 2);
                  console.log(d > VIRUS_SIZE / 2);
                  return d > VIRUS_SIZE / 2;
                }),
                takeLast(1),
                tap(() => console.log('pass')),
                map(p =>
                  p && {
                    player: p.player,
                    time: p.time - virus.time
                  }
                ),
                tap(results => toPlayers('results', results)),
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
