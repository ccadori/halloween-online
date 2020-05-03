module.exports = function (client) {
  // On player name
  client.on('player-position', (position) => {
    this.currentRoom.emitAll('player-position', position, client.id);
  });
}
