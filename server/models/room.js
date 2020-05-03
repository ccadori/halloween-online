const roles = require('../utils/roles');

class Room {
  constructor(id, masterPlayer) {
    this.master = masterPlayer;
    this.started = false;
    this.id = id;
    this.players = [];

    this.emitAll = this.emitAll.bind(this);
    this.removeClient = this.removeClient.bind(this);
    this.addClient = this.addClient.bind(this);
    this.findPlayer = this.findPlayer.bind(this);
    this.generatePlayersRoles = this.generatePlayersRoles.bind(this);
    this.start = this.start.bind(this);

    // FIXME: add masterplayer to tests so we cant take this condition out
    if (masterPlayer)
      this.addClient(masterPlayer);
  }
  
  emitAll (event, message, exceptionId) {
    this.players.map(p => {
      if (p.id === exceptionId) return;
      p.emit(event, message);
    });
  }

  removeClient (clientId) {
    //TODO: In case master player is exiting room, define other player as master

    this.players = this.players.filter(p => p.id !== clientId);

    this.emitAll('player-disconnected', clientId);
  }

  addClient (client) {
    if (this.players.find(p => p.id === client.id))
      return false;
    
    // Updating other players about the new one
    const payload = JSON.stringify({ name: client.name, id: client.id });
    this.emitAll('player-connected', payload, client.id);
    
    // Updating new player about the other ones
    this.players.map(p => {
      client.emit('player-connected', JSON.stringify({ id: p.id, name: p.name }));
    });

    this.players.push(client);

    return true;
  }

  findPlayer (clientId) {
    return this.players.find(p => p.id === clientId);
  }

  generatePlayersRoles() {
    const generatedRoles = roles.generateRoles(this.players.length);
    
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].role = generatedRoles[i];
      this.players[i].emit("role-set", JSON.stringify({ id: generatedRoles[i].id }));
    }
  }

  start() {
    this.generatePlayersRoles();
    this.started = true;
  }
};

module.exports = Room;
