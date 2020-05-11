# Endpoints

Are listed in this document all events from client and server.

## Events from Client

- **matchmaking-create ({ name } ):** Create room
- **matchmaking-join ({ name, roomId }):** Join a room
- **room-start ():** Start match (can only be called by room creator)

## Events from Server

- **matchmaking-connected ({ id: roomId }):** Successfully connected
- **matchmaking-error (error message):** Error when joining match
- **player-connected ({ name, id }):** New player in the room
- **player-disconnected (playerID):** A player has disconnected
- **room-start-error (error message):** Error when starting match
- **match-start ():** Starting match
- **night-start ():** Night has started
- **night-end ():** Night has ended
