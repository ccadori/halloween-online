const Match = require('./match');
const Player = require('./player');

class PlayerActions {
  /**
   * @param {Match} match 
   */
  constructor(match) {
    this.match = match;
  }

  /**
   * When player sends an action
   * @param {Player} player 
   * @param {Object} payload 
   */
  onPlayerAction(player, payload) {
    
  }
}

module.exports = PlayerActions;
