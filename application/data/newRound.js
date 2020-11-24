const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient()

const newRound = async ({ gameId, username }) => {
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
        if (err) return err;
        else {
            table = data;
        }
    }).promise();
    if (table["Item"]["user1"] != username) {
        return "You are not the host";
    }
    let zeroArr = ['', '', '', '', '', ''];
    let zeroes = [0, 0, 0, 0, 0, 0];
    let killRoom = '';
    let won = 'false';
    if (table['Item']['aliveI'].length == 0) {
        console.log('test');
        won = 'crewmate';
        // imposter win
    }
    else if (table['Item']['aliveC'].length <= 1) {
        won = 'imposter';
        //crewmate win
        //consider if they vote imposter in same round that imposter kills enough to win
    }
    else if (table['Item']['crewPoints'] >= 12) {
        won = 'crewmate';
        //crewmate win
    }
    let params2 = undefined;
    let emp = '';
    if (won == 'false') {
        params2 = {
            TableName: 'turn-based-game',
            Key: {
                gameId: gameId
            },
            UpdateExpression: `SET vote = :zeroArr, rooms = :zeroArr, minigame= :zeroes, killRoom = :killRoom, lastEjected = :emp, lastKilled = :emp`,
            ExpressionAttributeValues: {
                ':zeroArr': zeroArr,
                ':zeroes': zeroes,
                ':killRoom': killRoom,
                ':emp': emp
            },
            ReturnValues: 'ALL_NEW'
        }
    }
    else {
        params2 = {
            TableName: 'turn-based-game',
            Key: {
                gameId: gameId
            },
            UpdateExpression: `SET won = :won`,
            ExpressionAttributeValues: {
                ':won': won
            },
            ReturnValues: 'UPDATED_NEW'
        }
    }
    try {
        const resp = await documentClient.update(params2).promise()
        console.log('Updated game: ', resp.Attributes)
        return (resp.Attributes);
    } catch (error) {
        console.log('Error updating item: ', error.message)
        return ("Failed to start new round. Try again");
    }
}

module.exports = newRound;