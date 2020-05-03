module.exports = function (client, room) {
  client.on('room-start', () => {
    if (client.id !== room.master.id)
      return client.emit('room-start-error', 'Permission denied');
    
    room.start();
  });
}
