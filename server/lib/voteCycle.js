const Cycle = require('../utils/cycle');

class VoteCycle extends Cycle {
  /**
   * @param {Match} match 
   */
  constructor(match, duration = 30000) {
    super(duration);

    this.match = match;
    this.alreadyVoted = [];
    this.votes = {};
    this.lastReport = {};

    this.start = this.start.bind(this);
    this.end = this.end.bind(this);
    this.onPlayerVote = this.onPlayerVote.bind(this);
    this.generateReport = this.generateReport.bind(this);
  }

  /**
   * Starts the night
   */
  start() {
    super.start();
  }

  /**
   * Ends the night
   */
  end() {
    if (!this.running) return;
    
    super.end();

    this.lastReport = this.generateReport();
  
    this.votes = {};
    this.alreadyVoted = [];

    if (this.match.onVoteEnd)
      this.match.onVoteEnd();
  }

  generateReport() {
    let draw = false;
    let target = null;

    Object.keys(this.votes).map(key => {
      if (!target)
        target = { id: key, quantity: this.votes[key] };
      else {
        if (target.quantity < this.votes[key]) {
          target = { id: key, quantity: this.votes[key] };
          draw = false;
        }
        else if (target.quantity == this.votes[key]) {
          draw = true;
        }
      }
    });

    return { votedPlayersId: target && !draw ? [ target.id ] : [] };
  }

  /**
   * @param {*} player 
   */
  onPlayerVote(player, payload) {
    if (this.alreadyVoted.includes(player.id))
      return;

    this.alreadyVoted.push(player.id);

    if (payload && payload.targetId) {
      this.votes[payload.targetId] = (this.votes[payload.targetId] || 0) + 1;
    }

    if (this.alreadyVoted.length == this.match.alivePlayers().length)
      this.end();
  }
}

module.exports = VoteCycle;