const AWS = require("aws-sdk")
const documentClient = new AWS.DynamoDB.DocumentClient()

const killPlayer = async ({ gameId, target }) => {
    if (typeof gameId != 'string' || typeof target != 'string') throw new Error("Invalid input");
    const params = {
        TableName: "turn-based-game",
        Key: {
            gameId: gameId
        }
    };
    let table = undefined;
    await documentClient.get(params, function (err, data) {
        if (err) {
            console.log(err);
            throw new Error("")
        }
        else {
            table = data;
        }
    }).promise();

    if (target == "" || target == undefined || target == table["Item"]["aliveI"]) {
        throw new Error("Invalid target name");
    }

    let index = -1;
    for (var i = 0; i < table['Item']['aliveC'].length; i++) {
        if (table['Item']['aliveC'][i] == target) {
            index = i;
        }
    }

    if (index == -1) {
        throw new Error("Target is not alive or is not a valid player name");
    }
    const newAlive = removeIndex(table["Item"]["aliveC"], index);
    const alive = table["Item"]["aliveT"] - 1;
    const params2 = {
        TableName: 'turn-based-game',
        Key: {
            gameId: gameId
        },
        UpdateExpression: `SET aliveC = :newAlive, aliveT = :alive`,
        ExpressionAttributeValues: {
            ':newAlive': newAlive,
            ':alive': alive
        },
        ReturnValues: 'UPDATED_NEW'
    }
    try {
        const resp = await documentClient.update(params2).promise()
        console.log('Updated game: ', resp.Attributes)
        return ("Tango down");
    } catch (error) {
        console.log('Error updating item: ', error.message)
        return ("Failed to kill. Try again");
    }
}

function removeIndex(arr, index) {
    let ret = [];
    for (var i = 0; i < arr.length; i++) {
        if (i != index) {
            ret.push(arr[i]);
        }
    }
    return ret;
}

module.exports = killPlayer;