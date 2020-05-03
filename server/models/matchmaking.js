const random = require('randomstring');
const Room = require('../models/room');

class Matchmaking {
  constructor() {
    this.rooms = [];

    this.addRoom = this.addRoom.bind(this);
    this.findRoom = this.findRoom.bind(this);
  }

  addRoom(masterClient) {
    const newRoom = new Room(random.generate(10), masterClient);
    this.rooms.push(newRoom);
    
    return newRoom;
  }

  findRoom(id) {
    return this.rooms.find(r => r.id === id);
  }
}

module.exports = Matchmaking;
