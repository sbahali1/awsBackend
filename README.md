# awsBackend
Saurav Bahali
This code is a copy of what lives on the AWS backend

Endpoints:

**
:KEY
Indicates a value to be passed as set of backward slash delimited paramters
**

GET: /lobby/:gameId
Returns an array of the current players in a lobby

GET: /alive/:gameId/:user
Returns a boolean indicating whether player is alive

GET: /alive/:gameId
Returns an array of all currently alive players

DELETE: /kill/:gameId/:target
Used to kill a player as the imposter

PUT: /vote/:gameId/:user/:target
Used to vote to eject a player during voting phase

PUT: /room/:gameId/:user/:room
Used to select a room

POST: /minigame/:gameId/:user/:score
Used to send information about the status of a minigame

POST: /eject/:gameId/:username
Used to initiate the ejection process (Fails if anyone but the host, user1, initiates)

POST: /newRound/:gameId/:username
Used to initiate a new round of play (Fails if anyone but the host, user1, initiates)

PUT: /newGame/:gameId/:user1
Used to initiate a new game

GET: /games/:gameId/:attr
Returns the attribute specified

POST: /games/addPlayer/:gameId
Used to join a lobby

Database Attributes:
aliveC: List of alive crewmates
aliveI: Imposter username, if they are alive
crewPoints: Number of minigames completed
gameId: ID of the game
killRoom: Room where a murder took place, if any
lastEjected: Username of the last player who was ejected
minigame: Array of minigame scores during the round
rooms: Array of rooms that players were in
user1,...,user6: usernames of the users
vote: Array of votes cast
won: String which takes on values of ['false','imposter','crewmate'] indicating who has won the game
lastKilled: Username of the player who was killed most recently
killed: Array of usernames of all players killed by the imposter

For a demo of the game, see the link below
https://www.youtube.com/watch?v=kk3ujBXXMJo&feature=emb_title
