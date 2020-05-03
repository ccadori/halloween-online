const Matchmaking = require('../models/matchmaking');

const matchmaking = new Matchmaking();

module.exports = function (client) {
  client.on('matchmaking-create', () => {
    const id = matchmaking.addRoom(client);
    client.emit('matchmaking-connected', id);
  });

  client.on('matchmaking-join', id => {
    const room = matchmaking.findRoom(id);

    if (!room) return client.emit('matchmaking-invalid-id')
    
    room.addClient(client);
    client.emit('matchmaking-connected', room.id);
  });
};
