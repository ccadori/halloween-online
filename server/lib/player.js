class Player {
  constructor(client, name) {
    this.name = name || client.id;
    this.client = client;
    this.id = client.id;
    this.alive = true;
    this.role = null;
    this.online = true;

    this.emit = this.emit.bind(this);
  }

  emit(event, payload) {
    if (this.online)
      this.client.emit(event, payload);
  }
}

module.exports = Player;
