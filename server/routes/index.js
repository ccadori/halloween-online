const room = require('../utils/room');

const currentRoom = new room();

const routes = [
  require('./room'),
  require('./position'),
];

const connect = (client) => {
  console.log("User has connected", client.id);
  routes.map(r => r.bind({ currentRoom })(client));
  client.on('disconnect', disconnect.bind(client));
}

const disconnect = function () {
  currentRoom.removeClient(this.id);
  console.log("User has disconnected", this.id);
}

module.exports = connect
