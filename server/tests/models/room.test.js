const Room = require('../../models/room');
const Player = require('../../models/player');

describe('room', () => {
  it('Should add a new client', () => {
    const currentRoom = new Room();
    currentRoom.addPlayer({ id: 1, name: 'test' });

    expect(currentRoom.players.length).toBe(1);
    expect(currentRoom.players[0].name).toBe('test');
    expect(currentRoom.players[0].id).toBe(1);
  });

  it('Should emit connected events when a player connect', () => {
    let p1Event = {};
    const client1 = { 
      id: 1,
      name: 'test1', 
      client: { 
        emit: (event, message) => {
          p1Event = { event, message: JSON.parse(message) } 
        }
      }
    };
    
    let p2Event = {};
    const client2 = { 
      id: 2, 
      name: 'test2',
      client: {
        emit: (event, message) => {
          p2Event = { event, message: JSON.parse(message) } 
        }
      }
    };

    const currentRoom = new Room();
    currentRoom.addPlayer(client1);
    currentRoom.addPlayer(client2);

    expect(p1Event).toBeDefined();
    expect(p2Event).toBeDefined();
    expect(p1Event).toEqual({ 
      event: 'player-connected', 
      message: { id: 2, name: 'test2' } 
    });
    expect(p2Event).toEqual({ 
      event: 'player-connected', 
      message: { id: 1, name: 'test1' } 
    });
  });

  it('Should find the client', () => {
    const currentRoom = new Room();
    currentRoom.addPlayer({ id: 1 }, 'test');
    const client = currentRoom.findPlayer(1);

    expect(client).toBeDefined();
    expect(client.id).toBe(1);
  });

  it('Should remove a client', () => {
    const currentRoom = new Room();
    currentRoom.addPlayer({ id: 1 }, 'test');
    currentRoom.removePlayer(1);

    expect(currentRoom.length).toBeFalsy();
  });

  it('Should emit to all clients', () => {
    let eventCount = 0;
    const emit = () => { eventCount++ };

    const currentRoom = new Room();
    currentRoom.addPlayer({ id: 1, client: { emit } }, 'test');
    currentRoom.addPlayer({ id: 2, client: { emit } }, 'test');
    currentRoom.addPlayer({ id: 3, client: { emit } }, 'test');

    eventCount = 0;
    currentRoom.emitAll('test');

    expect(eventCount).toBe(3);
  });

  it('Should emit to all except one', () => {
    let clientIds = [];

    const currentRoom = new Room();
    currentRoom.addPlayer({ id: 1, client: { emit: () => clientIds.push(1) } }, 'test');
    currentRoom.addPlayer({ id: 2, client: { emit: () => clientIds.push(2) } }, 'test');
    currentRoom.addPlayer({ id: 3, client: { emit: () => clientIds.push(3) } }, 'test');

    clientIds = [];
    currentRoom.emitAll('test', null, 2);

    expect(clientIds.length).toBe(2);
    expect(clientIds.includes(2)).toBeFalsy();
  });

  it('Should emit to all the right event', () => {
    let event = {};

    const currentRoom = new Room();
    currentRoom.addPlayer({
      id: 1,
      client: {
        emit: (e, message) => event = { e, message }
      }
    }, 'test');

    event = {};
    currentRoom.emitAll('test', 1);

    expect(event).toBeDefined();
    expect(event.e).toBe('test');
    expect(event.message).toBe(1);
  });
});
