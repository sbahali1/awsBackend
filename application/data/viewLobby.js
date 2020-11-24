const AWS = require("aws-sdk")
const documentClient = new AWS.DynamoDB.DocumentClient()

const fetchGame = async ({ gameId }) => {
    const params = {
        TableName: "turn-based-game",
        Key: {
            gameId: gameId
        }
    };
    var documentClient = new AWS.DynamoDB.DocumentClient();
    try {
        const game = await documentClient.get(params).promise();
        let arr = [];
        for (var i = 1; i < 7; i++) {
            if (game["Item"]["user" + i] != '') {
                arr.push(game["Item"]["user" + i]);
            }
        }
        return arr;
    } catch (error) {
        console.log("Error fetching game: ", error.message);
        return ("Could not fetch attribute");
    }
}

module.exports = fetchGame;