const PlayerActions = require('../../lib/playerActions');
const Cycles = require('../../lib/cycles');

describe("player actions", () => {
  it("Shouldn't break", () => {
    const player = { id: 101 };
    const match = { players: [player] };
    const cycles = new Cycles(match);
    const playerActions = new PlayerActions(match, cycles);
    
    playerActions.onPlayerAction(player)

    expect(true).toBeTruthy();
  });
});
