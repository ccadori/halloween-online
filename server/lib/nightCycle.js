const Match = require('./match');
const Player = require('./player');
const Cycle = require('../utils/cycle');

class Cycles extends Cycle {
  /**
   * @param {Match} match 
   */
  constructor(match, duration = 30000) {
    super(duration);

    this.match = match;
    this.alreadyPlayed = [];

    this.start = this.start.bind(this);
    this.end = this.end.bind(this);
    this.onPlayerAction = this.onPlayerAction.bind(this);
  }

  /**
   * Starts the night
   */
  start() {
    super.start();
    this.match.emitToAll('night-started');
  }

  /**
   * Ends the night
   */
  end() {
    if (!this.running) return;

    super.end();

    this.alreadyPlayed = [];

    this.match.onNightEnd();
  }

  /**
   * @param {*} player 
   */
  onPlayerAction(player) {
    if (this.alreadyPlayed.includes(player.id))
      return;
    
    this.alreadyPlayed.push(player.id);
    
    if (this.alreadyPlayed.length == this.match.alivePlayers().length)
      this.end();
  }
}

module.exports = Cycles;
