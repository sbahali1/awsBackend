const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient()

const addPlayer = async ({ gameId, username }) => {
    function findPlayerNo(gameState, player) {
        for (var i = 1; i < 7; i++) {
            if (gameState['Item']['user' + i] == player) {
                return i;
            }
        }
        return -1;//cannot be found
    }
    //check if username is valid
    if (username == "" || username == undefined || gameId == "" || gameId == undefined) throw new Error("Game ID or username invalid");
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
    if (findPlayerNo(table, username) != -1) throw new Error("Player already exists");
    let userToDefine = undefined;
    for (var i = 1; i < 7; i++) {
        if (table['Item']['user' + i] == '' && userToDefine == undefined) {
            userToDefine = 'user' + i;
        }
    }
    if (userToDefine == undefined) throw new Error("Lobby is full");
    if (userToDefine != 'user6') {
        let params2 = {
            TableName: 'turn-based-game',
            Key: {
                gameId: gameId
            },
            UpdateExpression: `SET #userToDefine = :username`,
            ExpressionAttributeNames: {
                '#userToDefine': userToDefine
            },
            ExpressionAttributeValues: {
                ':username': username
            },
            ReturnValues: 'UPDATED_NEW'
        }
        documentClient = new AWS.DynamoDB.DocumentClient();

        try {
            const resp = await documentClient.update(params2).promise()
            console.log('Updated game: ', resp.Attributes)
        } catch (error) {
            console.log('Error updating item: ', error.message)
        }
    }
    else {
        //choose imposter and fill the aliveI, aliveC
        let imposter = Math.ceil(Math.random() * 6);
        let tempArrC = [];
        let imposterName = table['Item']['user' + imposter];
        for (var i = 1; i < 7; i++) {
            if (i != imposter && i != 6) {
                tempArrC.push(table['Item']['user' + i]);
            }
            if (i == 6 && imposter != 6) {
                tempArrC.push(username);
            }
        }
        if (imposter == 6) imposterName = username;

        let params2 = {
            TableName: 'turn-based-game',
            Key: {
                gameId: gameId
            },
            UpdateExpression: `SET #userToDefine = :username, aliveI=:imposterName, aliveC=:tempArrC`,
            ExpressionAttributeNames: {
                '#userToDefine': userToDefine
            },
            ExpressionAttributeValues: {
                ':username': username,
                ':imposterName': imposterName,
                ':tempArrC': tempArrC
            },
            ReturnValues: 'UPDATED_NEW'
        }
        documentClient = new AWS.DynamoDB.DocumentClient();
        try {
            const resp = await documentClient.update(params2).promise()
            console.log('Updated game: ', resp.Attributes)
            return ("Added new player" + username);
        } catch (error) {
            console.log('Error updating item: ', error.message)
            return ('Failed to add player');
        }

    }
}
module.exports = addPlayer;