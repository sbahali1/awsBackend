const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

const createGame = async ({ gameId, user1 }) => {
  if(gameId==""||user1==""||user1==undefined||gameId==undefined) throw new Error("Invalid input");
  //check if gameId already exists
  const params = {
  TableName: 'turn-based-game',
  ConditionExpression: 'attribute_not_exists(gameId)',
    Item: {
        gameId: gameId,
        user1: user1,
        user2: '',
        user3: '',
        user4: '',
        user5: '',
        user6: '',
        crewPoints: 0,
        aliveI: '',
        aliveC: ['', '', '', '', ''],
        vote: ['null','null','null','null','null','null'],
        rooms: ['null','null','null','null','null','null'],
        minigame: [0, 0, 0, 0, 0, 0],
        killRoom: 0,
        aliveT: 6,
        won: 'false',
        lastEjected: '',
        lastKilled: '',
        killed: []
    }
};
  try {
    await documentClient.put(params).promise();
  } catch (error) {
    console.log("Error creating game: ", error.message);
    throw new Error("Could not create game");
  }
/*
  const message = `Hi ${opponent.username}. Your friend ${creator} has invited you to a new game! Your game ID is ${params.Item.gameId}`;
  try {
    await sendMessage({ phoneNumber: opponent.phoneNumber, message });
  } catch (error) {
    console.log("Error sending message: ", error.message);
    throw new Error("Could not send message to user");
  }
*/
  return params.Item;
};

module.exports = createGame;
