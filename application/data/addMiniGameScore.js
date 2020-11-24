const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

const addMiniGameScore = async ({ gameId, user, score }) => {
    //get current score
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
    //calculate new score
    const newScore = table['Item']['crewPoints'] + score;
    let newMiniGame = table['Item']['minigame'];
    let userNo = -1;
    for (var i = 1; i < 7; i++) {
        if (table['Item']['user' + i] == user) {
            userNo = i;
        }
    }

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

    //validates user info
    if (userNo == -1) throw new Error("Could not find player");
    if (!checkAlive(table, user)) throw new Error("Player is dead");

    newMiniGame[userNo - 1] = score;
    const params2 = {
        TableName: 'turn-based-game',
        Key: {
            gameId: gameId
        },
        UpdateExpression: `SET crewPoints = :newScore, minigame= :newMiniGame`,
        ExpressionAttributeValues: {
            ':newScore': newScore,
            ':newMiniGame': newMiniGame
        },
        ReturnValues: 'UPDATED_NEW'
    }

    try {
        const resp = await documentClient.update(params2).promise()
        console.log('Updated game: ', resp.Attributes)
        return ("Added minigame score successfully");
    } catch (error) {
        console.log('Error updating item: ', error.message)
        return ("Failed to add minigame score");
    }
}

module.exports = addMiniGameScore;