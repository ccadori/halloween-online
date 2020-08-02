const roles = require('../utils/roles');
const NightCycle = require('./nightCycle');
const VoteCycle = require('./voteCycle');
const Player = require('./player');
const PlayerActions = require('./playerActions');
const parser = require('../utils/parser');
const Matchmaking = require('./matchmaking');

class Match {
  /**
   * @param {Number} id 
   * @param {Player} masterPlayer 
   * @param {Matchmaking} matchmaking 
   */
  constructor(id, masterPlayer, matchmaking) {
    this.master = masterPlayer;
    this.matchmaking = matchmaking;
    this.started = false;
    this.id = id;
    this.players = [];
    this.nightCycle = new NightCycle(this);
    this.voteCycle = new VoteCycle(this);
    this.playerActions = new PlayerActions(this, this.nightCycle);

    this.onRoomStart = this.onRoomStart.bind(this);
    this.onPlayerEnter = this.onPlayerEnter.bind(this);
    this.onPlayerExit = this.onPlayerExit.bind(this);
    this.onNightEnd = this.onNightEnd.bind(this);
    
    if (masterPlayer) this.addPlayer(masterPlayer);
  }
  
  /**
   * Return all alive players
   */
  alivePlayers() {
    return this.players.filter(p => p.alive);
  }

  evilPlayers() {
    return this.players.filter(p => p.role.alignment === "evil");
  }

  aliveAndOnlinePlayers() {
    return this.alivePlayers().filter(player => player.online);
  }

  onNightEnd() {
    this.playerActions.execute();  
    const report = this.playerActions.generateReport();
    this.playerActions.reset();
    this.emitToAll('night-ended');
    this.emitToAll('night-report', JSON.stringify(report));
    
    const win = this.checkVictory();
    if (win) {
      this.emitToAll('match-end', JSON.stringify(win));
      return;  
    }

    this.voteCycle.start();
    this.emitToAll('vote-started');
  }

  onVoteEnd() {
    const report = this.voteCycle.lastReport
    
    if (report.votedPlayersId && report.votedPlayersId.length > 0 && report.votedPlayersId[0])
    {
      this.alivePlayers().map(p => { if (p.id == report.votedPlayersId[0]) p.alive = false });
    }
    
    this.emitToAll('vote-report', JSON.stringify(report));
    
    const win = this.checkVictory();
    if (win) {
      this.emitToAll('match-end', JSON.stringify(win));
      return;  
    }
    
    this.nightCycle.start();
  }

  checkVictory() {
    let alignment = null;
    
    for (let player of this.alivePlayers()) {
      if (!alignment) {
        alignment = player.role.alignment;
        continue;
      }

      if (alignment != player.role.alignment) {
        return null;
      }
    }
    
    return { isTownWinner: alignment == 'town'? true : false };
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
      p.emit(event, payload);
    });
  }

  emitToAllEvil (event, payload) {
    const evilPlayers = this.evilPlayers();
    
    for (let player of evilPlayers)
      player.emit(event, payload);
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
      player.emit('player-connected', JSON.stringify({ id: p.id, name: p.name }));
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
      this.players[i].emit("role-set", JSON.stringify({ id: generatedRoles[i].id }));
    }

    const evilPlayersID = this.evilPlayers().map(p => p.id);
    this.emitToAll("alignment-players", JSON.stringify({ playersID: evilPlayersID }));
  }

  /**
   * Starts the match
   */
  start() {
    this.generatePlayersRoles();
    this.started = true;
    this.emitToAll('match-started');
    this.nightCycle.start();
  }

  /**
   * When client tries to start the match
   * @param {Player} player 
   */
  onRoomStart(player) {
    if (player !== this.master)
      player.emit('room-start-error');

    this.start();
  }

  onPlayerAction(player, payload) {
    this.playerActions.onPlayerAction(player, payload);
    this.nightCycle.onPlayerAction(player);
  }

  /**
   * When a new player enter the room
   * @param {Player} player 
   */
  onPlayerEnter(player) {
    player.client.on('room-start', (payload) => this.onRoomStart(player, parser.convert(payload)));
    player.client.on('player-action', (payload) => this.onPlayerAction(player, parser.convert(payload)));
    player.client.on('action-skip', (payload) => this.nightCycle.onPlayerAction(player, parser.convert(payload)));
    player.client.on('player-vote', (payload) => this.voteCycle.onPlayerVote(player, parser.convert(payload)));
    player.client.on('vote-skip', (payload) => this.voteCycle.onPlayerVote(player, parser.convert(payload)));
    player.client.on('disconnect', () => this.onPlayerExit(player));
  }

  /**
   * When a new player exits the room
   * @param {Player} player 
   */
  onPlayerExit(player) {
    if (this.started) {
      player.online = false;
    }
    else {
      this.players.splice(this.players.indexOf(player), 1);
    }

    player.client.removeAllListeners('room-start');
    player.client.removeAllListeners('player-action');
    player.client.removeAllListeners('disconnect');
    player.client.removeAllListeners('player-vote');
    player.client.removeAllListeners('vote-skip');
  }
};

module.exports = Match;
