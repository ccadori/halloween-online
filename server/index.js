const socketio = require('socket.io');
const http = require('http');
const routes = require('./routes');

const server = http.createServer();
const io = socketio(server);

io.on("connection", (socket) => {
  routes(socket);
});

server.listen(3000, () => {
  console.log("listening at 3000");
});
