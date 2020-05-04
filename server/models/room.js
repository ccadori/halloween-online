const roles = require('../utils/roles');

class Room {
  constructor(id, masterPlayer) {
    this.master = masterPlayer;
    this.started = false;
    this.id = id;
    this.players = [];

    this.emitAll = this.emitAll.bind(this);
    this.removePlayer = this.removePlayer.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.findPlayer = this.findPlayer.bind(this);
    this.generatePlayersRoles = this.generatePlayersRoles.bind(this);
    this.start = this.start.bind(this);
    this.onNightStart = this.onNightStart.bind(this);
    this.onNightEnd = this.onNightEnd.bind(this);

    this.isNight = true;

    // FIXME: add masterplayer to tests so we cant take this condition out
    if (masterPlayer)
      this.addPlayer(masterPlayer);
  }
  
  emitAll (event, message, exceptionId) {
    this.players.map(p => {
      if (p.id === exceptionId) return;
      p.client.emit(event, message);
    });
  }

  removePlayer (clientId) {
    //TODO: In case master player is exiting room, define other player as master

    this.players = this.players.filter(p => p.id !== clientId);

    this.emitAll('player-disconnected', clientId);
  }

  addPlayer (player) {
    // Return in case player is already in the room
    if (this.players.find(p => p.id === player.id))
      return false;
    
    // Updating other players about the new one
    const payload = JSON.stringify({ name: player.name, id: player.id });
    this.emitAll('player-connected', payload, player.id);
    
    // Updating new player about the other ones
    this.players.map(p => {
      player.client.emit('player-connected', JSON.stringify({ id: p.id, name: p.name }));
    });

    this.players.push(player);

    return true;
  }

  findPlayer (clientId) {
    return this.players.find(p => p.id === clientId);
  }

  generatePlayersRoles() {
    const generatedRoles = roles.generateRoles(this.players.length);
    
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].role = generatedRoles[i];
      this.players[i].client.emit("role-set", JSON.stringify({ id: generatedRoles[i].id }));
    }
  }

  start() {
    this.generatePlayersRoles();
    this.started = true;
    this.emitAll('room-start');
    this.onNightStart();
  }

  onNightStart() {
    this.isNight = true;
    this.emitAll('night-start');
  }

  onNightEnd() {
    if (!this.isNight) return false;
    
    this.isNight = false;
    this.emitAll('night-end');
  }
};

module.exports = Room;
