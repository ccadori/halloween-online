const Matchmaking = require('../models/matchmaking');
const Player = require('../models/player');
const gameRoutes = require('./game');

const matchmaking = new Matchmaking();

/**
 * 
 * @param {any} client 
 */
const setup = function (client) {
  // Creating a new room
  client.on('matchmaking-create', payload => {
    const newPlayer = new Player(client, payload.name || client.id);
    const room = matchmaking.addRoom(newPlayer);

    // Removing listeners
    newPlayer.client.removeAllListeners('matchmaking-create');
    newPlayer.client.removeAllListeners('matchmaking-join');

    gameRoutes(newPlayer, room);

    newPlayer.client.emit('matchmaking-connected', room.id);
  });

  // Joining room
  client.on('matchmaking-join', payload => {
    const room = matchmaking.findRoom(payload.id);
    
    if (!room) 
      return client.emit('matchmaking-error', 'Room not found');
    
    // Removing listeners
    client.removeAllListeners('matchmaking-create');
    client.removeAllListeners('matchmaking-join');

    const newPlayer = new Player(client, payload.name || payload.id);
    gameRoutes(newPlayer, room);

    newPlayer.client.name = payload.name? payload.name : client.id;

    room.addPlayer(newPlayer.client);
    newPlayer.client.emit('matchmaking-connected', room.id);
  });
};

module.exports = setup;