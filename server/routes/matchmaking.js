const Matchmaking = require('../models/matchmaking');
const gameRoutes = require('./game');

const matchmaking = new Matchmaking();

module.exports = function (client) {
  client.on('matchmaking-create', payload => {
    client.name = payload.name? payload.name : client.id;
    const room = matchmaking.addRoom(client);

    // Removing listeners
    client.removeAllListeners('matchmaking-create');
    client.removeAllListeners('matchmaking-join');

    gameRoutes(client, room);

    client.emit('matchmaking-connected', room.id);
  });

  client.on('matchmaking-join', payload => {
    const room = matchmaking.findRoom(payload.id);
    
    if (!room) 
      return client.emit('matchmaking-error', 'Room not found');
    
    // Removing listeners
    client.removeAllListeners('matchmaking-create');
    client.removeAllListeners('matchmaking-join');

    gameRoutes(client, room);

    client.name = payload.name? payload.name : client.id;

    room.addClient(client);
    client.emit('matchmaking-connected', room.id);
  });
};
