const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient()

const ejectPlayer = async ({ gameId }) => {
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

    function findPlayerNo(gameState, player) {
        for (var i = 1; i < 7; i++) {
            if (gameState['Item']['user' + i] == player) {
                return i;
            }
        }
        return -1;//cannot be found
    }

    let count = [0, 0, 0, 0, 0, 0];
    let numVotes = 0;
    let user = '';
    const votes = table['Item']['vote'];
    for (var j = 0; j < 6; j++) {
        //determine who gets ejected
        let index = findPlayerNo(table, votes[j]) - 1;
        if (index >= 0) {
            numVotes++;
        }
        count[index] = count[index] + 1;
    }

    let needed = table["Item"]["aliveT"];
    needed = Math.trunc(needed / 2);
    //change length
    if (numVotes >= needed) {
        let curr = count[0];
        let tie = false;
        for (var k = 1; k < 6; k++) {
            if (count[k] > count[curr]) {
                curr = k;
                tie = false;
            }
            else if (count[k] == count[curr]) {
                tie = true;
            }
        }
        if (tie) {
            return "No player ejected due to tie in votes";
        }
        user = table['Item']['user' + (curr + 1)];
    }
    else {
        return "No player ejected";
    }

    let newAlive = undefined;
    let ejected = false;
    let impasta = true;
    let params2 = undefined;
    let alive = table.Item.aliveT;
    alive--;

    for (var i = 0; i < table['Item']['aliveC'].length; i++) {
        if (table['Item']['aliveC'][i] == user) {
            newAlive = removeIndex(table['Item']['aliveC'], i);
            impasta = false;
            ejected = true;
            params2 = {
                TableName: 'turn-based-game',
                Key: {
                    gameId: gameId
                },
                UpdateExpression: `SET aliveC = :newAlive, aliveT = :alive, lastEjected = :user`,
                ExpressionAttributeValues: {
                    ':newAlive': newAlive,
                    ':alive': alive,
                    ':user': user
                },
                ReturnValues: 'UPDATED_NEW'
            }
        }
    }

    if (impasta && table['Item']['aliveI'] == user) {
        newAlive = '';
        ejected = true;
        params2 = {
            TableName: 'turn-based-game',
            Key: {
                gameId: gameId
            },
            UpdateExpression: `SET aliveI = :newAlive, aliveT = :alive`,
            ExpressionAttributeValues: {
                ':newAlive': newAlive,
                ':alive': alive
            },
            ReturnValues: 'UPDATED_NEW'
        }
    }


    if (!ejected) {
        //return error saying ejected player is already dead
        //should never happen, validate votes earlier
        throw new Error("Ejected player is already dead");
    }

    try {
        const resp = await documentClient.update(params2).promise()
        console.log('Updated game: ', resp.Attributes);
        return ("Player ejected");
    } catch (error) {
        console.log('Error updating item: ', error.message)
        return ("Failed to eject. Please try again");
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
module.exports = ejectPlayer;
