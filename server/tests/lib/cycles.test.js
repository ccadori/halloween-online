const Cycles = require('../../lib/cycles');

describe("cycles", () => {
  it("Should add a user to passed turn", () => {
    const player = { id: 101 };
    const match = { alivePlayers: () => [player], onNightEnded: () => {} };
    const cycles = new Cycles(match);
    
    cycles.onPlayerEndTurn(player);

    expect(cycles.passedTurn.length).toEqual(1);
    expect(cycles.passedTurn[0]).toEqual(101);
  });

  it("Should not add a user to passed turn when it is already in it", () => {
    const player = { id: 101 };
    const match = { alivePlayers: () => [player], onNightEnded: () => {} };
    const cycles = new Cycles(match);
    
    cycles.onPlayerEndTurn(player);
    cycles.onPlayerEndTurn(player);

    expect(cycles.passedTurn.length).toEqual(1);
    expect(cycles.passedTurn[0]).toEqual(101);
  });

  it("Should end the night when all the users have already passed the turn", () => {
    const player = { id: 101 };
    const match = { alivePlayers: () => [player], onNightEnded: () => {} };
    const cycles = new Cycles(match);
    cycles.isNight = true;
    
    cycles.onPlayerEndTurn(player);

    expect(cycles.isNight).toBeFalsy();
  });
});
