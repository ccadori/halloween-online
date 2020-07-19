const Match = require('./match');
const Player = require('./player');
const Cycles = require('./cycles');

class PlayerActions {
  /**
   * @param {Match} match 
   * @param {Cycles} cycles
   */
  constructor(match, cycles) {
    this.match = match;
    this.cycles = cycles;

    this.onPlayerAction = this.onPlayerAction.bind(this);
  }

  /**
   * When player sends an action
   * @param {Player} player 
   * @param {Object} payload 
   */
  onPlayerAction(player, payload) {
    if (this.cycles.passedTurn.includes(player.id)) 
      return;

    switch (player.role)
    {
      case ("Werewolf"):
        {
          console.log("Werewold action");
        }

      case ("Seer"):
        {
          console.log("Seer action");
        }
    }
  }
}

module.exports = PlayerActions;
