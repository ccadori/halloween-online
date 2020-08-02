const Match = require('../../lib/match');
const Player = require('../../lib/player');
const Client = require('../mocking/client');

describe('room', () => {
  it('Should add a new client', () => {
    const currentMatch = new Match(1, null);
    const player = new Player(new Client(), "test");
    currentMatch.addPlayer(player);

    expect(currentMatch.players.length).toBe(1);
    expect(currentMatch.players[0]).toEqual(player);
  });

  it('Should emit connected events when a player connect', () => {
    const currentMatch = new Match(1, null);

    const player = new Player(new Client(), "test");
    const player2 = new Player(new Client(), "test2");

    currentMatch.addPlayer(player);
    currentMatch.addPlayer(player2);

    expect(player.client.events[0]).toBeDefined();
    expect(player.client.events[0].event).toEqual('player-connected');
    expect(JSON.parse(player.client.events[0].payload)).toEqual({ id: player2.id, name: player2.name });

    expect(player2.client.events[0]).toBeDefined();
    expect(player2.client.events[0].event).toEqual('player-connected');
    expect(JSON.parse(player2.client.events[0].payload)).toEqual({ id: player.id, name: player.name });
  });

  it('Should find the client', () => {
    const currentMatch = new Match(1, null);
    const player = new Player(new Client(), "test");
    currentMatch.addPlayer(player);

    expect(currentMatch.findPlayer(player.id)).toBeDefined();
    expect(currentMatch.findPlayer(player.id)).toEqual(player);
  });

  it('Should remove a client', () => {
    const currentMatch = new Match(1, null);
    const player = new Player(new Client(), "test");
    currentMatch.addPlayer(player);

    currentMatch.removePlayer(player.id);

    expect(currentMatch.players.length).toBe(0);
  });

  it('Should emit to all clients', () => {
    const currentMatch = new Match(1, null);

    const player = new Player(new Client(), "test");
    const player2 = new Player(new Client(), "test2");

    currentMatch.addPlayer(player);
    currentMatch.addPlayer(player2);

    currentMatch.emitToAll('test');

    expect(player.client.events[1]).toBeDefined();
    expect(player.client.events[1].event).toBe('test');

    expect(player2.client.events[1]).toBeDefined();
    expect(player2.client.events[1].event).toBe('test');
  });

  it("Should return only evil players", () => {
    const currentMatch = new Match(1, null);

    const player = new Player(new Client(), "test");
    const player2 = new Player(new Client(), "test2");
    player.role = { alignment: "town" };
    player2.role = { alignment: "evil" };

    currentMatch.addPlayer(player);
    currentMatch.addPlayer(player2);

    const evilPlayers = currentMatch.evilPlayers();

    expect(evilPlayers.length).toEqual(1);
    expect(evilPlayers[0].id).toEqual(player2.id);
  });

  it('Should emit to all except one', () => {
    const currentMatch = new Match(1, null);

    const player = new Player(new Client(), "test");
    const player2 = new Player(new Client(), "test2");
    const player3 = new Player(new Client(), "test3");

    currentMatch.addPlayer(player);
    currentMatch.addPlayer(player2);
    currentMatch.addPlayer(player3);

    currentMatch.emitToAll('test', null, player3.id);

    expect(player.client.events.length).toBe(3);
    expect(player2.client.events.length).toBe(3);
    expect(player3.client.events.length).toBe(2);
  });

  it("Should start a match", () => {
    const player = new Player(new Client(), "test");
    const player2 = new Player(new Client(), "test2");
    const match = new Match(1, player);
    
    match.addPlayer(player2);

    player.client.emitToServer('room-start');

    expect(match.started).toBeTruthy();
    expect(player.client.events.find(e => e.event === 'match-started')).toBeDefined();
    expect(player2.client.events.find(e => e.event === 'match-started')).toBeDefined();
  });

  it("Should return only alive players", () => {
    const player = new Player({ on: () => {} }, "1");
    const player2 = new Player({ on: () => {} }, "2");
    const match = new Match(1, player);
    match.players.push(player2);
    player2.alive = false;

    const alivePlayers = match.alivePlayers();

    expect(match.players.length).toEqual(2);
    expect(alivePlayers.length).toEqual(1);
    expect(alivePlayers[0].name).toEqual("1");
  });

  it ("Should not return a victory", () => {
    const player = { role: { alignment: "evil" }, alive: true };
    const player2 = { role: { alignment: "town" }, alive: true };
    const player3 = { role: { alignment: "town" }, alive: true };
    const match = new Match(1);
    match.players = [player, player2, player3];

    expect(match.checkVictory()).toBeNull();
  });

  it ("Should not return a town victory", () => {
    const player2 = { role: { alignment: "town" }, alive: true };
    const player3 = { role: { alignment: "town" }, alive: true };
    const match = new Match(1);
    match.players = [player2, player3];

    expect(match.checkVictory()).toEqual({ isTownWinner: true });
  });

  it ("Should not return an evil victory", () => {
    const player2 = { role: { alignment: "evil" }, alive: true };
    const match = new Match(1);
    match.players = [player2];

    expect(match.checkVictory()).toEqual({ isTownWinner: false });
  });
});
