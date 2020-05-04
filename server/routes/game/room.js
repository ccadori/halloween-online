const Player = require('../../models/player');
const Room = require('../../models/room');

/**
 * 
 * @param {Player} player 
 * @param {Room} room 
 */
const setup = function (player, room) {
  player.client.on('room-start', () => {
    if (player.id !== room.master.id)
      return player.client.emit('room-start-error', 'Permission denied');
    
    room.start();
  });
}

module.exports = setup;