const Cycle = require('../../utils/cycle');

describe('cycle', () => {
  it ('Should end when the time is over', async () => {
    const cycle = new Cycle(1);
    cycle.start();
    
    expect(cycle.running).toBeTruthy();

    await new Promise(resolve => setTimeout(() => resolve(), 2));

    expect(cycle.running).toBeFalsy();
  });
  
  it ('Should cancel the timeout when forced to end', async () => {
    const cycle = new Cycle(2);
    cycle.start();
    cycle.end();
    cycle.running = true;

    await new Promise(resolve => setTimeout(() => resolve(), 3));

    expect(cycle.running).toEqual(true);
  });
});