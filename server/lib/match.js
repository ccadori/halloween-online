const roles = require('../utils/roles');
const Cycles = require('./cycles');
const Player = require('./player');
const PlayerActions = require('./playerActions');
const parser = require('../utils/parser');

class Match {
  /**
   * @param {Number} id 
   * @param {Player} masterPlayer 
   */
  constructor(id, masterPlayer) {
    this.master = masterPlayer;
    this.started = false;
    this.id = id;
    this.players = [];
    this.cycles = new Cycles(this);
    this.playerActions = new PlayerActions(this, this.cycles);

    this.emitToAll = this.emitToAll.bind(this);
    this.removePlayer = this.removePlayer.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.findPlayer = this.findPlayer.bind(this);
    this.generatePlayersRoles = this.generatePlayersRoles.bind(this);
    this.start = this.start.bind(this);
    this.onRoomStart = this.onRoomStart.bind(this);
    this.onPlayerEnter = this.onPlayerEnter.bind(this);
    this.onPlayerExit = this.onPlayerExit.bind(this);
    this.onNightEnded = this.onNightEnded.bind(this);
    
    if (masterPlayer) this.addPlayer(masterPlayer);
  }
  
  /**
   * Return all alive players
   */
  alivePlayers() {
    return this.players.filter(p => p.alive);
  }

  onNightEnded() {
    this.playerActions.execute();  
    const report = this.playerActions.generateReport();
    this.playerActions.clear();
    this.emitToAll('night-ended');
    this.emitToAll('night-report', report);
  }

  /**
   * Emit an event to all players
   * @param {String} event 
   * @param {*} payload 
   * @param {Number} playerExceptionId
   */
  emitToAll (event, payload, playerExceptionId) {
    this.players.map(p => {
      if (p.id === playerExceptionId) return;
      p.client.emit(event, payload);
    });
  }

  /**
   * Removes a player from the match
   * @param {Number} playerId 
   */
  removePlayer (playerId) {
    //TODO: In case master player is exiting room, define other player as master

    this.players = this.players.filter(p => p.id !== playerId);

    this.emitToAll('player-disconnected', playerId);
  }

  /**
   * Add a new player to the match
   * @param {Object} player 
   */
  addPlayer (player) {
    // Return in case player is already in the room
    if (this.started || this.players.find(p => p.id === player.id))
      return false;
    
    // Updating other players about the new one
    const payload = JSON.stringify({ name: player.name, id: player.id });
    this.emitToAll('player-connected', payload, player.id);
    
    // Updating new player about the other ones
    this.players.map(p => {
      player.client.emit('player-connected', JSON.stringify({ id: p.id, name: p.name }));
    });

    this.players.push(player);

    this.onPlayerEnter(player);

    return true;
  }

  /**
   * Encontra um jogador na partida
   * @param {Number} playerId 
   */
  findPlayer (playerId) {
    return this.players.find(p => p.id === playerId);
  }

  /**
   * Generate roles for each player and send to it
   */
  generatePlayersRoles() {
    const generatedRoles = roles.generateRoles(this.players.length);
    
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].role = generatedRoles[i];
      this.players[i].client.emit("role-set", JSON.stringify({ id: generatedRoles[i].id }));
    }
  }

  /**
   * Starts the match
   */
  start() {
    this.generatePlayersRoles();
    this.started = true;
    this.emitToAll('match-started');
    this.cycles.startNight();
  }

  /**
   * When client tries to start the match
   * @param {Player} player 
   */
  onRoomStart(player) {
    if (player !== this.master)
      player.client.emit('room-start-error');

    this.start();
  }

  /**
   * When a new player enter the room
   * @param {Player} player 
   */
  onPlayerEnter(player) {
    player.client.on('room-start', (payload) => this.onRoomStart(player, parser.convert(payload)));
    player.client.on('player-action', (payload) => this.cycles.onPlayerEndTurn(player, parser.convert(payload)));
    player.client.on('player-action', (payload) => this.playerActions.onPlayerAction(player, parser.convert(payload)));
    player.client.on('action-skip', (payload) => this.cycles.onPlayerEndTurn(player, parser.convert(payload)));
    player.client.on('disconnect', () => this.onPlayerExit(player));
  }

  /**
   * When a new player exits the room
   * @param {Player} player 
   */
  onPlayerExit(player) {
    player.client.removeAllListeners('room-start');
    player.client.removeAllListeners('player-action');
    player.client.removeAllListeners('disconnect');
  }
};

module.exports = Match;
