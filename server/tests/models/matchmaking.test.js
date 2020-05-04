const Matchmaking = require('../../models/matchmaking');

describe("Matchmaking", () => {
  it("Should add a new room", () => {
    const matchmaking = new Matchmaking();
    const client = { id: 1 }
    const room = matchmaking.addRoom(client);

    expect(matchmaking.rooms[0]).toEqual(room);
  });

  it("Should find a room", () => {
    const matchmaking = new Matchmaking();
    const client = { id: 1 }
    const room = matchmaking.addRoom(client);

    expect(matchmaking.findRoom(room.id)).toEqual(room);
  });

  it ("Should define a room id", () => {
    const matchmaking = new Matchmaking();
    const client = { id: 1 }
    const room = matchmaking.addRoom(client);

    expect(room.id).toBeDefined();
  });
});
