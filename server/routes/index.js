const routes = [
  require('./matchmaking'),
];

const connect = (client) => {
  console.log("User has connected from lobby", client.id);
  routes.map(r => r(client));
  client.on('disconnect', disconnect.bind(client));
}

const disconnect = function () {
  console.log("User has disconnected from lobby", this.id);
}

module.exports = connect
