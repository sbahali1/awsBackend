const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient()

const newRound = async ({ gameId }) => {
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

    let zeroArr = ['', '', '', '', '', ''];
    let killRoom = ['', ''];
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
    if (won == 'false') {
        params2 = {
            TableName: 'turn-based-game',
            Key: {
                gameId: gameId
            },
            UpdateExpression: `SET vote = :zeroArr, rooms = :zeroArr, minigame= :zeroArr, killRoom = :killRoom`,
            ExpressionAttributeValues: {
                ':zeroArr': zeroArr,
                ':killRoom': killRoom
            },
            ReturnValues: 'UPDATED_NEW'
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
        return ("New round initiated");
    } catch (error) {
        console.log('Error updating item: ', error.message)
        return ("Failed to start new round. Try again");
    }
}

module.exports = newRound;