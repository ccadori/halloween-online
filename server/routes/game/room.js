module.exports = function (client) {
  // client.on('player-name', (name) => {
  //   if (this.currentRoom.addClient(client, name)) {
  //     console.log("User has entered the game", client.id);
  //     client.emit('player-name-accepted');
  //   }
  //   else {
  //     client.emit('player-name-rejected');
  //     console.log("User is already in the game", client.id);
  //   }
  // });

  // client.on('player-ready', (ready) => {
  //   const player = this.currentRoom.findPlayer(client.id);
  //   player.ready = true;
  //   this.currentRoom.emitAll('player-ready', client.id, client.id);
  // });

  // client.on('player-unready', (ready) => {
  //   const player = this.currentRoom.findPlayer(client.id);
  //   player.ready = false;
  //   this.currentRoom.emitAll('player-unready', client.id, client.id);
  // });
}
