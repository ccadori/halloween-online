const random = require('randomstring');
const Match = require('./match');
const Player = require('./player');
const parser = require('../utils/parser');

class Matchmaking {
  constructor() {
    this.matches = [];

    this.addMatch = this.addMatch.bind(this);
    this.findMatch = this.findMatch.bind(this);
    this.onCreateRoom = this.onCreateRoom.bind(this);
    this.onJoinRoom = this.onJoinRoom.bind(this);
    this.onClientEnter = this.onClientEnter.bind(this);
    this.onClientExit = this.onClientExit.bind(this);
  }

  /**
   * Create a match with a master client
   * @param {Player} masterClient 
   */
  addMatch(masterClient) {
    const newMatch = new Match(random.generate(5).toUpperCase(), masterClient);
    this.matches.push(newMatch);
    
    return newMatch;
  }

  /**
   * Find a match by its id
   * @param {String} id 
   */
  findMatch(id) {
    return this.matches.find(r => r.id == id);
  }

  /**
   * Tries to create a room
   * @param {Object} client 
   * @param {Object} payload 
   */
  onCreateRoom(client, payload) {
    const newPlayer = new Player(client, payload.name);
    const match = this.addMatch(newPlayer);

    this.onClientExit(client);

    newPlayer.emit('matchmaking-connected', match.id);
  }

  /**
   * 
   * @param {Object} client 
   * @param {Object} payload 
   */
  onJoinRoom(client, payload) {
    const match = this.findMatch(payload.roomId);
    
    if (!match) 
      return client.emit('matchmaking-error', 'Room not found');
    
    if (match.started) 
      return client.emit('matchmaking-error', 'Match already started');

    this.onClientExit(client);
    
    const newPlayer = new Player(client, payload.name)
    match.addPlayer(newPlayer);
    newPlayer.emit('matchmaking-connected', match.id);
  }

  /**
   * When a new client connects to the matchmaking
   * @param {Object} client 
   */
  onClientEnter(client) {
    client.on('matchmaking-join', (payload) => this.onJoinRoom(client, parser.convert(payload)));
    client.on('matchmaking-create', (payload) => this.onCreateRoom(client, parser.convert(payload)));
    client.on('disconnect', () => this.onClientExit(client));
  }

  /**
   * When a client exits from the matchmaking
   * @param {Object} client 
   */
  onClientExit(client) {
    client.removeAllListeners('matchmaking-create');
    client.removeAllListeners('matchmaking-join');
    client.removeAllListeners('disconnect');
  }
}

module.exports = Matchmaking;
