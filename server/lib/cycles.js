const Match = require('./match');
const Player = require('./player');
const nightDuration = 30000;

class Cycles {
  /**
   * @param {Match} match 
   */
  constructor(match) {
    this.match = match;
    this.isNight = false;
    this.nightTimeout = null;
    this.passedTurn = [];

    this.startNight = this.startNight.bind(this);
    this.endNight = this.endNight.bind(this);
    this.onPlayerEndTurn = this.onPlayerEndTurn.bind(this);
  }

  /**
   * Starts the night
   */
  startNight() {
    this.isNight = true;
    this.match.emitToAll('night-started');
    this.passedTurn = [];

    this.nightTimeout = setTimeout(this.endNight, nightDuration);
  }

  /**
   * Ends the night
   */
  endNight() {
    if (!this.isNight) return false;
    
    this.isNight = false;
    this.match.onNightEnded();
  }

  /**
   * When a client ends its turn
   * @param {Player} player 
   */
  onPlayerEndTurn(player) {
    if (this.passedTurn.includes(player.id))
      return;
    
    this.passedTurn.push(player.id);
    
    if (this.passedTurn.length == this.match.alivePlayers().length) {
      this.endNight();
      
      if (this.nightTimeout) 
        clearTimeout(this.nightTimeout);
    }
  }
}

module.exports = Cycles;
