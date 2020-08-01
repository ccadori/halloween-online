class Cycles {
  constructor(duration, onEnd, onStart) {
    this.duration = duration;
    this.onEnd = onEnd;
    this.onStart = onStart;
    this.cycleTimeout = null;
    this.running = false;

    this.start = this.start.bind(this);
    this.end = this.end.bind(this);
  }

  start() {
    this.cycleTimeout = setTimeout(this.end, this.duration);
    this.running = true;
    
    if (this.onStart) this.onStart();
  }

  end() {
    if (!this.running) return;

    this.running = false;

    if (this.cycleTimeout) clearTimeout(this.cycleTimeout);

    if (this.onEnd) this.onEnd();
  }
}

module.exports = Cycles;
