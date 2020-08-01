const VoteCycle = require('../../lib/voteCycle');

describe("vote cycle", () => {
  it("Should add votes", () => {
    const voteCycle = new VoteCycle({ aliveAndOnlinePlayers: () => [{}, {}, {}] }, 1);
    voteCycle.onPlayerVote({ id: 1 }, { targetId: 3 });

    expect(voteCycle.votes[3]).toEqual(1);

    voteCycle.onPlayerVote({ id: 2 }, { targetId: 3 });

    expect(voteCycle.votes[3]).toEqual(2);
  });

  it ("Should generate a target report", () => {
    const voteCycle = new VoteCycle({ aliveAndOnlinePlayers: () => [{}, {}, {}, {}] }, 1);
    voteCycle.start();
    voteCycle.onPlayerVote({ id: 1 }, { targetId: 3 });
    voteCycle.onPlayerVote({ id: 2 }, { targetId: 3 });
    voteCycle.onPlayerVote({ id: 3 }, { targetId: 2 });

    expect(voteCycle.generateReport().votedPlayersId.length).toEqual(1);
    expect(voteCycle.generateReport().votedPlayersId[0]).toEqual("3");
  });

  it ("Should generate a draw report", () => {
    const voteCycle = new VoteCycle({ aliveAndOnlinePlayers: () => [{}, {}, {}] }, 1);
    voteCycle.start();
    voteCycle.onPlayerVote({ id: 1 }, { targetId: 3 });
    voteCycle.onPlayerVote({ id: 3 }, { targetId: 2 });
    
    expect(voteCycle.generateReport().votedPlayersId.length).toEqual(0);
  });

  it ("Should generate the report after voting ends", () => {
    const voteCycle = new VoteCycle({ aliveAndOnlinePlayers: () => [{}, {}, {}] }, 1);
    voteCycle.start();
    
    voteCycle.onPlayerVote({ id: 1 }, { targetId: 3 });

    voteCycle.end();
    
    expect(voteCycle.lastReport).toBeDefined();
    expect(voteCycle.lastReport.votedPlayersId).toBeDefined();
  });
});
