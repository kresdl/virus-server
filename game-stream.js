'use strict';

const { SETS, VIRUS_SIZE, SCOPE_RADIUS,
  GAME_DELAY, SET_DELAY, MAX_VIRUS_DELAY } = process.env,

  { player$, fromClick } = require('./player'),

  { of, merge, range } = require('rxjs'),

  { map, tap, toArray, concatMap, mergeMap,
    delay, skipWhile, take, timeoutWith } = require('rxjs/operators'),

  scatter = r => {
    const r2 = r * Math.sqrt(Math.random()),
      theta = Math.random() * 2 * Math.PI,
      x = r + r2 * Math.cos(theta),
      y = r + r2 * Math.sin(theta);
    return { x, y };
  },

  toPlayers = (players, type, data) => players.forEach(({ socket }) => {
    socket.connected && socket.emit(type, data)
  });

module.exports = player$.pipe(
  pairwise(),
  tap(players => toPlayers(players, 'ready', 
    players.map(p => p.name))),
  delay(GAME_DELAY),
  mergeMap(players =>
    range(0, SETS).pipe(
      concatMap(() =>
        of(0).pipe(
          tap(() => toPlayers(players, 'start')),
          delay(MAX_VIRUS_DELAY * Math.random()),
          map(() => ({
            ...scatter(+SCOPE_RADIUS),
            variant: Math.floor(3 * Math.random()),
            time: Date.now()
          })),
          tap(({ x, y, variant }) => toPlayers(players,
            'virus', { x, y, variant })),
          mergeMap(virus =>
            merge(
              fromClick(players[0]),
              fromClick(players[1])
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
              tap(results => toPlayers(players,
                results ? 'results' : 'miss', results)),
              delay(SET_DELAY)
            )
          )
        )
      ),
      toArray(),
      tap(results => toPlayers(players, 'end', results))
    )
  ),
);
