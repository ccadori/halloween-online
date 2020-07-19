class Player {
  constructor(client, name) {
    this.name = name || client.id;
    this.client = client;
    this.id = client.id;
    this.alive = true;
    this.role = null;
  }
}

module.exports = Player;
