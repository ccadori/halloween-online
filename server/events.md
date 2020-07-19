# Endpoints

All game events events are listed in this document.

## Events from Client

- **matchmaking-create ({ name } ):** Create room
- **matchmaking-join ({ name, roomId }):** Join a room
- **room-start ():** Start match (can only be called by room creator)
- **player-action ({ targetId }):** Execute the player role's action

## Events from Server

- **matchmaking-connected ({ id: roomId }):** Successfully connected
- **matchmaking-error (error message):** Error when joining match
- **player-connected ({ name, id }):** New player in the room
- **player-disconnected (playerID):** A player has disconnected
- **room-start-error (error message):** Error when starting match
- **match-started ():** Starting match
- **night-started ():** Night has started
- **night-ended ():** Night has ended
