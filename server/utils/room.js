module.exports = function () {
  this.players = [];
  
  this.emitAll = (event, message, exceptionId) => {
    this.players.map(p => {
      if (p.id === exceptionId) return;
      p.client.emit(event, message);
    });
  };

  this.removeClient = (clientId) => {
    this.players = this.players.filter(p => p.id !== clientId);

    this.emitAll('player-disconnected', clientId);
  };

  this.addClient = (client, name) => {
    if (this.players.find(p => p.id === client.id))
      return false;
    
    // Updating other players about the new one
    const payload = JSON.stringify({ name, id: client.id });
    this.emitAll('player-connected', payload, client.id);
    
    // Updating new player about the other ones
    this.players.map(p => {
      client.emit('player-connected', JSON.stringify({ id: p.id, name: p.name }));
    });

    this.players.push({ 
      id: client.id, 
      name, 
      client, 
      ready: false 
    });

    return true;
  };

  this.findPlayer = (clientId) => {
    return this.players.find(p => p.id === clientId);
  }

  return this;
};
