const Match = require('./match');
const Player = require('./player');
const Cycles = require('./nightCycle');

class PlayerActions {
  /**
   * @param {Match} match 
   * @param {Cycles} cycles
   */
  constructor(match, cycles) {
    this.match = match;
    this.cycles = cycles;
    this.alreadyPlayed = [];
    this.queue = { deaths: [], saves: [] };

    this.onPlayerAction = this.onPlayerAction.bind(this);
    this.generateReport = this.generateReport.bind(this);
    this.werewolfAction = this.werewolfAction.bind(this);
    this.seerAction = this.seerAction.bind(this);
    this.execute = this.execute.bind(this);
    this.clear = this.reset.bind(this);
  }

  /**
   * When player sends an action
   * @param {Player} player 
   * @param {Object} payload 
   */
  onPlayerAction(player, payload) {
    if (!player.alive && this.cycles.alreadyPlayed.includes(player.id)) 
      return false;
    
    if (!payload)
      return true;

    switch (player.role.name)
    {
      case "Werewolf": return this.werewolfAction(player, payload);
      case "Seer": return this.seerAction(player, payload);
      case "Medic": return this.medicAction(player, payload);
    }

    return true;
  }

  werewolfAction(player, payload) {
    this.queue.deaths.push(payload.targetId);
  }

  seerAction(player, payload) {
    const targetPlayer = this.match.players.find(p => p.id == payload.targetId);
    player.emit('action-result-seer', JSON.stringify({ roleId: targetPlayer.role.id }));
  }

  /**
   * @param {Player} player 
   * @param {*} payload 
   */
  medicAction(player, payload) {
    if (!payload.targetId) return;
    
    this.queue.saves.push(payload.targetId);
  }

  /**
   * Execute all the queued actions
   * @param {Array<Player>} players 
   */
  execute() {
    for (let id of this.queue.saves) {
      if (this.queue.deaths.includes(id)) 
        this.queue.deaths.splice(this.queue.deaths.indexOf(id), 1);
    }
    
    for (let id of this.queue.deaths) {
      const player = this.match.players.find(p => p.id == id);
      if (player) player.alive = false;
    }
  }

  generateReport() {
    return { deadPlayersId: [ ...this.queue.deaths ] };
  }

  /**
   * Clear all the executed actions
   */
  reset() {
    this.queue = { deaths: [], saves: [] };
  }
}

module.exports = PlayerActions;
