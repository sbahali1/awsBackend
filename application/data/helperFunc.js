function checkAlive(gameState, player) {
    for (var i = 0; i < gameState['Item']['aliveC'].length; i++) {
        if (gameState['Item']['aliveC'][i] == player) {
            return true;
        }
    }
    if(gameState['Item']['aliveI'] == player) {
        return true;
    }
    
    return false;
}
function findPlayerNo(gameState,player){
    for (var i = 1; i < 7; i++) {
        if (gameState['Item']['user' + i] == player) {
            return i;
        }
    }
    return -1;//cannot be found
}
module.exports = {
    checkAlive,
    findPlayerNo
};