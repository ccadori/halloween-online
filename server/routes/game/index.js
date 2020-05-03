const routes = [
  require('./room'),
];

const connect = (client, room) => {
  console.log("User has connected to game", client.id);
  routes.map(r => r(client, room));
  client.on('disconnect', disconnect.bind({ client, room }));
}

const disconnect = function () {
  console.log("User has disconnected from game", this.client.id);
}

module.exports = connect
