class Room {
  constructor(id, masterPlayer) {
    this.master = masterPlayer;
    this.id = id;
    this.players = [];

    this.emitAll = this.emitAll.bind(this);
    this.removeClient = this.removeClient.bind(this);
    this.addClient = this.addClient.bind(this);
    this.findPlayer = this.findPlayer.bind(this);

    // FIXME: add masterplayer to tests so we cant take this condition out
    if (masterPlayer)
      this.addClient(masterPlayer);
  }
  
  emitAll (event, message, exceptionId) {
    this.players.map(p => {
      if (p.id === exceptionId) return;
      p.client.emit(event, message);
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
};

module.exports = Room;
