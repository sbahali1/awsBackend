const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient()

const selectRoom = async ({ gameId, user, room }) => {
    //get current score
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

    let newRoom = table['Item']['rooms'];
    let userNo = findPlayerNo(table, user);
    if (userNo == -1) {
        //return an error that player could not be found
        throw new Error("The player could not be found");
    }
    //check if person already dead
    if (!checkAlive(table, user)) {
        throw new Error("Player is already dead");
    }


    newRoom[userNo - 1] = room;
    //check if target voted is alive

    let params2 = {
        TableName: 'turn-based-game',
        Key: {
            gameId: gameId
        },
        UpdateExpression: `SET rooms = :newRoom`,
        ExpressionAttributeValues: {
            ':newRoom': newRoom
        },
        ReturnValues: 'UPDATED_NEW'
    };



    try {
        const resp = await documentClient.update(params2).promise()
        console.log('Updated game: ', resp.Attributes)
        return resp.Attributes;
    } catch (error) {
        console.log('Error updating item: ', error.message)
        return "Failed to select room";
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
    function findPlayerNo(gameState, player) {
        for (var i = 1; i < 7; i++) {
            if (gameState['Item']['user' + i] == player) {
                return i;
            }
        }
        return -1;//cannot be found
    }
}

module.exports = selectRoom;