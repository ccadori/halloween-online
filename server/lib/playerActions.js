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
    this.generateReport = this.generateReport.bind(this);
    this.queue = { deaths: [] };
    this.execute = this.execute.bind(this);
    this.clear = this.clear.bind(this);
  }

  /**
   * When player sends an action
   * @param {Player} player 
   * @param {Object} payload 
   */
  onPlayerAction(player, payload) {
    if (!player.alive && this.cycles.alreadyPlayer.includes(player.id)) 
      return false;

    switch (player.role.name)
    {
      case "Werewolf":
        {
          this.queue.deaths.push(payload.targetId);
          return;
        }

      case "Seer":
        {
          const targetPlayer = this.match.players.find(p => p.id == payload.targetId);
          player.client.emit('seer-result', JSON.stringify({ roleId: targetPlayer.role.id }));
          return;
        }
    }

    return true;
  }

  /**
   * Execute all the queued actions
   * @param {Array<Player>} players 
   */
  execute() {
    for (let id of this.queue.deaths) {
      const player = this.match.players.find(p => p.id == id);
      if (player) player.alive = false;
    }
  }

  /**
   * Clear all the executed actions
   */
  clear() {
    this.queue = { deaths: [] };
  }

  generateReport() {
    return { deadPlayersId: [ ...this.queue.deaths ] };
  }
}

module.exports = PlayerActions;
