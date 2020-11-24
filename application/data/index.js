// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const createGame = require("./createGame");
const fetchGame = require("./fetchGame");
const ejectPlayer = require("./ejectPlayer");
const addMiniGameScore = require("./addMiniGameScore");
const isPlayerAlive = require("./isPlayerAlive");
const killPlayer = require("./killPlayer");
const votePlayer = require("./votePlayer");
const newRound = require("./newRound");
const selectRoom = require("./selectRoom");
const getLivingPlayers = require("./getLivingPlayers");
const addPlayer = require("./addPlayer");
const helperFunc = require("./helperFunc");
const viewLobby = require("./viewLobby");

module.exports = {
    createGame,
    fetchGame,
    ejectPlayer,
    addMiniGameScore,
    isPlayerAlive,
    killPlayer,
    newRound,
    votePlayer,
    selectRoom,
    getLivingPlayers,
    addPlayer,
    helperFunc,
    viewLobby
};
