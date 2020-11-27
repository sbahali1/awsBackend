const AWS = require("aws-sdk")
const documentClient = new AWS.DynamoDB.DocumentClient()

const isPlayerAlive = async ({ gameId, user }) => {
    var params = {
        TableName: 'turn-based-game',
        Key: {
            gameId: gameId
        }
    };

    
    let table = undefined;
    await documentClient.get(params, function (err, data) {
        if (err) console.log(err);
        else {
            table = data;
        }
    }).promise();

    function checkAlive(gameState, player) {
        for (var i = 0; i < gameState['Item']['aliveC'].length; i++) {
            if (gameState['Item']['aliveC'][i] == player) {
                return true;
            }
        }
        if (gameState['Item']['aliveI'] == player) {
            return true;
        }

        return false;
    }

    let alive = checkAlive(table, user);
    console.log(alive);
    return alive;
}
module.exports = isPlayerAlive;