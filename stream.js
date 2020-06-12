'use strict';

const { env } = process,
  SETS = +env.SETS,
  VIRUS_SIZE = +env.VIRUS_SIZE,
  BOARD_SIZE = +env.BOARD_SIZE,
  GAME_DELAY = +env.GAME_DELAY,
  SET_DELAY = +env.SET_DELAY,
  MAX_VIRUS_DELAY = +env.MAX_VIRUS_DELAY,

  { fromEvent, of, merge, range } = require('rxjs'),

  { map, tap, toArray, concatMap, mergeMap,
    delay, takeLast, mergeMap, takeWhile, withLatestFrom } = require('rxjs/operators'),

  random = max => Math.floor(max * Math.random());

module.exports = {
  playerStream: player => fromEvent(users[player], 'click')
    .pipe(
      map(({ x, y }) => ({
        player, x, y,
        time: Date.now()
      }))
    ),

  gameStream = (p1, p2) => {
    const toPlayers = (type, data) => [p1, p2].forEach(p =>
      users[p].emit(type, data)
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
              mergeMap(
                of(0).pipe(
                  map(() => ({
                    x: random(BOARD_SIZE),
                    y: random(BOARD_SIZE),
                    variant: random(3),
                    time: Date.now()
                  })),
                  tap(({ x, y, variant }) => toPlayers('virus', { x, y, variant })),
                  withLatestFrom(
                    merge(
                      playerStream(p1),
                      playerStream(p2)
                    )
                  ),
                  takeWhile(([v, p]) => {
                    const d = Math.sqrt((v.x - p.x) ** 2 + (v.y - p.y) ** 2);
                    console.log(d);
                    return d > VIRUS_SIZE / 2;
                  }),
                  takeLast(1),
                  tap(console.log),
                  map(([v, p]) =>
                    p && {
                      player: p.player,
                      time: v.time - p.time
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
  }
}