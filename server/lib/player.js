class Player {
  constructor(client, name) {
    this.name = name || client.id;
    this.client = client;
    this.id = client.id;
    this.role = null;
  }
}

module.exports = Player;
