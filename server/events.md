# Endpoints

Are listed in this document all events from client and server.

## Events from Client

- **Create room:** matchmaking-create ({ name } )
- **Join a room:** matchmaking-join ({ name, roomId })
- **Start match (can only be called by room creator):** room-start ()

## Events from Server

- **Successfully connected:** matchmaking-connected ({ id: roomId })
- **Error when joining match:** matchmaking-error (error message)
- **New player in the room:** player-connected ({ name, id })
- **A player has disconnected:** player-disconnected (playerID)
- **Error when starting match:** room-start-error (error message)
- **Setting player role:** role-set ({ id: roleId })
