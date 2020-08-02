const PlayerActions = require('../../lib/playerActions');
const NightCicle = require('../../lib/nightCycle');

describe("player actions", () => {
  it("Should not allow a player to play twice", () => {
    const player = { id: 101, role: { name: "werewolf" } };
    const match = { players: [player] };
    const cycles = new NightCicle(match);
    const playerActions = new PlayerActions(match, cycles);
    
    cycles.alreadyPlayed = [player.id];

    expect(playerActions.onPlayerAction(player)).toBeFalsy();
  });

  it ("Should execute the seers action", () => {
    let role = "";
    const seer = { 
      id: 101, 
      role: { id: "seer", name: "Seer" }, 
      emit: (message, payload) => { role = JSON.parse(payload).roleId }
    };
    const werewolf = { 
      id: 102, 
      role: { id: "werewolf", name: "Werewolf" }
    };

    const match = { players: [werewolf, seer] };
    const nightCycle = new NightCicle(match);
    const playerActions = new PlayerActions(match, nightCycle);
    
    playerActions.onPlayerAction(seer, { targetId: 102 });

    expect(role).toEqual("werewolf");
  });

  it ("Should execute the werewolf action", () => {
    const werewolf = { 
      id: 101, 
      role: { name: "Werewolf" }
    };
    const villager = { 
      id: 102, 
      role: { name: "Villager" }
    };

    const match = { players: [ werewolf, villager ] };
    const cycles = new NightCicle(match);
    const playerActions = new PlayerActions(match, cycles);
    
    playerActions.onPlayerAction(werewolf, { targetId: 102 });

    expect(playerActions.queue.deaths.length).toEqual(1);
    expect(playerActions.queue.deaths[0]).toEqual(102);
  });

  it ("Should execute the medic action", () => {
    const medic = { 
      id: 101, 
      role: { name: "Medic" }
    };
    const villager = { 
      id: 102, 
      role: { name: "Villager" }
    };

    const match = { players: [ medic, villager ] };
    const cycles = new NightCicle(match);
    const playerActions = new PlayerActions(match, cycles);
    
    playerActions.onPlayerAction(medic, { targetId: 102 });

    expect(playerActions.queue.saves.length).toEqual(1);
    expect(playerActions.queue.saves[0]).toEqual(102);
  });

  it ("Should execute all queued actions", () => {
    const player1 = { id: 1, alive: true };
    const player2 = { id: 2, alive: true };
    const match = { players: [ player1, player2 ] };
    const cycles = new NightCicle(match);
    const playerActions = new PlayerActions(match, cycles);
    
    playerActions.queue.deaths = [1];

    playerActions.execute();

    expect(player1.alive).toBeFalsy();
    expect(player2.alive).toBeTruthy();
  });

  it ("Should generate an report", () => {
    const match = { players: [  ] };
    const cycles = new NightCicle(match);
    const playerActions = new PlayerActions(match, cycles);
    
    playerActions.queue.deaths = [2];
    const report = playerActions.generateReport();

    expect(report.deadPlayersId.length).toEqual(1);
    expect(report.deadPlayersId[0]).toEqual(2);
  });

  it ("Should clear queued actions", () => {
    const match = { players: [  ] };
    const cycles = new NightCicle(match);
    const playerActions = new PlayerActions(match, cycles);

    playerActions.queue.deaths = [2];
    playerActions.reset();

    expect(playerActions.queue.deaths.length).toEqual(0);
  });
});
