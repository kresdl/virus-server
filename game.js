'use strict';

const { SETS, VIRUS_SIZE, SCOPE_RADIUS,
  GAME_DELAY, SET_DELAY, MAX_VIRUS_DELAY, RESTART_DELAY } = process.env,

  { fromClick } = require('./player'),

  { of, merge, range, from } = require('rxjs'),

  { map, tap, toArray, concatMap, mergeMap, 
    delay, skipWhile, take, timeoutWith, bufferCount } = require('rxjs/operators'),

  scatter = r => {
    const r2 = r * Math.sqrt(Math.random()),
      theta = Math.random() * 2 * Math.PI,
      x = r + r2 * Math.cos(theta),
      y = r + r2 * Math.sin(theta);
    return { x, y };
  },

  toPlayers = (players, type, data) => players.forEach(({ socket }) => {
    socket.connected && socket.emit(type, data)
  }),

  game = player$ =>
    player$.pipe(
      tap(player => player.socket.emit('wait')),
      bufferCount(2),
      tap(players => players.forEach(({ name, socket }) =>
        socket.connected && socket.emit('ready', players
          .find(p => p.name !== name).name))),
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
                    results ? 'partial' : 'miss', results)),
                  delay(SET_DELAY)
                )
              )
            )
          ),
          toArray(),
          tap(results => toPlayers(players, 'results', results)),
          mergeMap(() =>
            from(players.filter(p => p.socket.connected))
          ),
          delay(RESTART_DELAY)
        )
      )
    );

module.exports = game;
