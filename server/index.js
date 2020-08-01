const socketio = require('socket.io');
const http = require('http');
const Matchmaking = require('./lib/matchmaking');

const server = http.createServer();
const io = socketio(server, { handlePreflightRequest: (req, res) => {
  const headers = {
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": req.headers.origin,
      "Access-Control-Allow-Credentials": true
  };
  res.writeHead(200, headers);
  res.end();
}});
const matchmaking = new Matchmaking();

io.on("connection", matchmaking.onClientEnter);

server.listen(3000, () => {
  console.log("listening at 3000");
});
