const NightCycle = require('../../lib/nightCycle');

describe("cycles", () => {
  it("Should add a user to passed turn", () => {
    const player = { id: 101 };
    const player2 = { id: 102 };
    const match = { aliveAndOnlinePlayers: () => [player, player2], onNightEnd: () => {} };
    const cycles = new NightCycle(match);
    
    cycles.onPlayerAction(player);

    expect(cycles.alreadyPlayed.length).toEqual(1);
    expect(cycles.alreadyPlayed[0]).toEqual(101);
  });

  it("Should not add a user to already played when it is already in it", () => {
    const player = { id: 101 };
    const player2 = { id: 102 };
    const match = { aliveAndOnlinePlayers: () => [player, player2], onNightEnd: () => {} };
    const cycles = new NightCycle(match);
    
    cycles.onPlayerAction(player);
    cycles.onPlayerAction(player);

    expect(cycles.alreadyPlayed.length).toEqual(1);
    expect(cycles.alreadyPlayed[0]).toEqual(101);
  });

  it("Should end the night when all the users have already passed the turn", () => {
    const player = { id: 101 };
    const match = { aliveAndOnlinePlayers: () => [player], onNightEnd: () => {} };
    const cycles = new NightCycle(match);
    cycles.running = true;
    
    cycles.onPlayerAction(player);

    expect(cycles.running).toBeFalsy();
  });
});
