const PlayerActions = require('../../lib/playerActions');
const Cycles = require('../../lib/cycles');

describe("player actions", () => {
  it("Should not allow a player to play twice", () => {
    const player = { id: 101, role: { name: "werewolf" } };
    const match = { players: [player] };
    const cycles = new Cycles(match);
    const playerActions = new PlayerActions(match, cycles);
    
    cycles.alreadyPlayer = [player.id];

    expect(playerActions.onPlayerAction(player)).toBeFalsy();
  });

  it ("Should execute the seers action", () => {
    let role = "";
    const seer = { 
      id: 101, 
      role: { id: "seer", name: "Seer" }, 
      client: { emit: (message, payload) => { role = payload.roleId }}
    };
    const werewolf = { 
      id: 102, 
      role: { id: "werewolf", name: "Werewolf" }
    };

    const match = { players: [werewolf, seer] };
    const cycles = new Cycles(match);
    const playerActions = new PlayerActions(match, cycles);
    
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
    const cycles = new Cycles(match);
    const playerActions = new PlayerActions(match, cycles);
    
    playerActions.onPlayerAction(werewolf, { targetId: 102 });

    expect(playerActions.queue.deaths.length).toEqual(1);
    expect(playerActions.queue.deaths[0]).toEqual(102);
  });

  it ("Should execute all queued actions", () => {
    const player1 = { id: 1, alive: true };
    const player2 = { id: 2, alive: true };
    const match = { players: [ player1, player2 ] };
    const cycles = new Cycles(match);
    const playerActions = new PlayerActions(match, cycles);
    
    playerActions.queue.deaths = [1];

    playerActions.execute();

    expect(player1.alive).toBeFalsy();
    expect(player2.alive).toBeTruthy();
  });

  it ("Should generate an report", () => {
    const match = { players: [  ] };
    const cycles = new Cycles(match);
    const playerActions = new PlayerActions(match, cycles);
    
    playerActions.queue.deaths = [2];
    const report = playerActions.generateReport();

    expect(report.deadPlayersId.length).toEqual(1);
    expect(report.deadPlayersId[0]).toEqual(2);
  });

  it ("Should clear queued actions", () => {
    const match = { players: [  ] };
    const cycles = new Cycles(match);
    const playerActions = new PlayerActions(match, cycles);

    playerActions.queue.deaths = [2];
    playerActions.clear();

    expect(playerActions.queue.deaths.length).toEqual(0);
  });
});
