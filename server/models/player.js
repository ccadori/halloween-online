class Player {
  constructor(client, name) {
    this.name = name;
    this.client = client;
    this.id = client.id;
    this.acted = false;
    this.role = null;
  }
}

module.exports = Player;
