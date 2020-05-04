module.exports = function (player, room) {
  player.client.on('room-start', () => {
    if (player.id !== room.master.id)
      return player.client.emit('room-start-error', 'Permission denied');
    
    room.start();
  });
}
