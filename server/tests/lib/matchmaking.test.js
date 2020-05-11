const Matchmaking = require('../../lib/matchmaking');
const Client = require('../mocking/client');
const Player = require('../../lib/player');

describe("Matchmaking", () => {
  it("Should add a new match", () => {
    const matchmaking = new Matchmaking();
    const player = new Player(new Client(), "test");
    const match = matchmaking.addMatch(player);

    expect(matchmaking.matches.length).toEqual(1);
    expect(matchmaking.matches[0]).toEqual(match);
  });

  it("Should find a match", () => {
    const matchmaking = new Matchmaking();
    const player = new Player(new Client(), "test");
    const match = matchmaking.addMatch(player);

    expect(matchmaking.findMatch(match.id)).toEqual(match);
  });

  it ("Should define a match id", () => {
    const matchmaking = new Matchmaking();
    const player = new Player(new Client(), "test");
    const match = matchmaking.addMatch(player);

    expect(match.id).toBeDefined();
  });
});
