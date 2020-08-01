# Endpoints

All game events events are listed in this document.

## Events from Client

- **matchmaking-create ({ name } ):** Create room
- **matchmaking-join ({ name, roomId }):** Join a room
- **room-start ():** Start match (can only be called by room creator)
- **player-action ({ targetId }):** Execute the player role's action
- **action-skip ():** Skip the player's turn
- **player-vote ({ targetId }):** Vote on someone
- **vote-skip ():** Skip player's vote

## Events from Server

- **matchmaking-connected ({ id: roomId }):** Successfully connected
- **matchmaking-error (error message):** Error when joining match
- **player-connected ({ name, id }):** New player in the room
- **player-disconnected (playerID):** A player has disconnected
- **room-start-error (error message):** Error when starting match
- **match-started ():** Starting match
- **role-set ({ id }):** Return the player's role
- **night-started ():** Night has started
- **night-ended ():** Night has ended
- **action-result-seer ({ roleId? }):** Returns the seer's action result
- **night-report ({ deadPlayersId }):** Return the reports from the last night
- **vote-started ():** Voting started
- **vote-report ({ votedPlayersId }):** Return the report of the voting
- **match-end ({ isTownWinner }):** Return the result of the match
