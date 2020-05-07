const routes = [
  require('./room'),
];

const connect = (player, room) => {
  console.log("User has connected to game", player.id);
  routes.map(r => r(player, room));
  player.client.on('disconnect', disconnect.bind({ player, room }));
}

const disconnect = function () {
  this.room.removePlayer(this.player.id);
  console.log("User has disconnected from game", this.player.id);
}

module.exports = connect
