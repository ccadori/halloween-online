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

  it ("Should receive match id", () => {
    const matchmaking = new Matchmaking();
    const client = new Client();
    matchmaking.onClientEnter(client);

    client.emitToServer('matchmaking-create', { name: "test" });
    
    expect(client.events.length).toBe(1);
    expect(client.events[0].payload).toBeDefined();
  });

  it ("Should be able to join a match", () => {
    const matchmaking = new Matchmaking();
    const client = new Client();
    const client2 = new Client();
    
    matchmaking.onClientEnter(client);
    matchmaking.onClientEnter(client2);

    client.emitToServer('matchmaking-create', { name: "test" });
    const token = client.events[0].payload;
    client2.emitToServer('matchmaking-join', { name: "test2", roomId: token });

    expect(client2.events.find(e => e.event == 'matchmaking-connected')).toBeDefined();
  });
});
