const AWS = require("aws-sdk")
const documentClient = new AWS.DynamoDB.DocumentClient()

const getLivingPlayers = async ({ gameId }) => {
    var params = {
        TableName: 'turn-based-game',
        Key: {
            gameId: gameId
        }
    };

    var documentClient = new AWS.DynamoDB.DocumentClient();
    let table = undefined;
    await documentClient.get(params, function (err, data) {
        if (err) console.log(err);
        else {
            table = data;
        }
    }).promise();

    let alive = [];
    for (var i = 0; i < table["Item"]["aliveC"].length; i++) {
        alive.push(table["Item"]["aliveC"][i]);
    }
    alive.push(table["Item"]["aliveI"]);
    return alive;
}

module.exports = getLivingPlayers;