const events = require('events');

class Client {
  constructor() {
    this.events = [];
    this.eventEmitter = new events();
    this.id = Math.random() * 100;

    this.emit = this.emit.bind(this);

    this.emitToServer = this.eventEmitter.emit;
    this.on = this.eventEmitter.on;
  }

  emit(event, payload) {
    this.events.push({ event, payload });
  }
}

module.exports = Client;
