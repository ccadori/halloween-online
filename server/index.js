const socketio = require('socket.io');
const http = require('http');
const Matchmaking = require('./lib/matchmaking');

const server = http.createServer();
const io = socketio(server);
const matchmaking = new Matchmaking();

io.on("connection", matchmaking.onClientEnter);

server.listen(3000, () => {
  console.log("listening at 3000");
});
