const AWS = require("aws-sdk")
const documentClient = new AWS.DynamoDB.DocumentClient()

const fetchGame = async ({ gameId, attr }) => {
    const params = {
        TableName: "turn-based-game",
        Key: {
            gameId: gameId
        }
    };
    /*if (!(attr == 'crewPoints' || attr == 'killRoom' || attr == 'minigame' || attr == 'rooms' || attr == 'vote')) {
        //if not asking for one of these, throw error
        throw new Error("Bad Request");
    }*/
    var documentClient = new AWS.DynamoDB.DocumentClient();
    try {
        const game = await documentClient.get(params).promise();
        console.log(game.Item[attr]);
        return game.Item[attr];
    } catch (error) {
        console.log("Error fetching game: ", error.message);
        return ("Could not fetch attribute");
    }
}

module.exports = fetchGame;