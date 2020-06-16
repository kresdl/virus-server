'use strict';

const { SETS, VIRUS_SIZE, SCOPE_RADIUS,
  GAME_DELAY, SET_DELAY, MAX_VIRUS_DELAY } = process.env,

  { fromEvent, of, range, from } = require('rxjs'),

  { map, tap, toArray, concatMap, mergeMap, takeUntil, mergeAll,
    delay, skipWhile, take, timeoutWith, bufferCount, mapTo } = require('rxjs/operators'),

  // Calculate random coordinate on a disc
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

  // Creates a stream of play again-requests for specific player

  // Game stream
  play = player$ =>
    player$.pipe(
      // Wait for contender
      tap(player => player.socket.emit('wait')),

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
              delay(MAX_VIRUS_DELAY * Math.random()),
              map(() => ({
                ...scatter(+SCOPE_RADIUS),
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
    );

module.exports = play;
