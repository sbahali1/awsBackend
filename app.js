const express = require("express");
const bodyParser = require("body-parser");
const { createGame, fetchGame, newRound, ejectPlayer, addMiniGameScore, votePlayer, addPlayer, killPlayer, isPlayerAlive, selectRoom, getLivingPlayers, viewLobby } = require("./data");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const axios = require("axios");
const cors = require("cors");
const corsO = {
    origin: true,
    methods: 'GET,PUT,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200
};
const app = express();
app.use(cors(corsO));
app.use(bodyParser.json());

app.options('*', cors(corsO));

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}

async function authenticatorFunc(req, res) {
    const FIREBASE_PUB_KEY_URI = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
    const pubKeyURIResp = await axios.get(FIREBASE_PUB_KEY_URI);
    const pubKey = pubKeyURIResp.data;

    /*
    console.log(kid);
    const key = await jose.JWK.asKey(pubKey[kid]);
    console.log(key);*/
    // verify JWT
    const auth = req.headers['authorization'];
    const token = auth && auth.split(' ')[1];
    try {
        const headers = jwt_decode(token, { header: true })
        const kid = headers.kid;
        const alg = headers.alg;
        const key = pubKey[kid];
        if (token == null) return 401;
        if (key == null) return 403;
        try {
            jwt.verify(token, key);
        } catch (e) {
            console.log(e);
            return 403;
        }
        return 200;
    }
    catch (e) {
        console.log(e);
        return 401;
    }
}


app.get("/lobby/:gameId", wrapAsync(async (req, res) => {
    const status = await authenticatorFunc(req, res);
    if (status != 200) {
        res.sendStatus(status);
        res.json("Unauthorized");
    }
    else {
        const param = {
            gameId: req.params.gameId
        };
        const val = await viewLobby(param);
        res.json(val);
    }
}));


//retrieve status of player
app.get("/alive/:gameId/:user", wrapAsync(async (req, res) => {
    const status = await authenticatorFunc(req, res);
    if (status != 200) {
        res.sendStatus(status);
        res.json("Unauthorized");
    }
    else {
        const param = {
            gameId: req.params.gameId,
            user: req.params.user,
        };
        const val = await isPlayerAlive(param);
        res.json(val);
    }
}));

//get living players
app.get("/alive/:gameId", wrapAsync(async (req, res) => {
    const status = await authenticatorFunc(req, res);
    if (status != 200) {
        res.sendStatus(status);
        res.json("Unauthorized");
    }
    else {
        const param = {
            gameId: req.params.gameId,
        };
        const val = await getLivingPlayers(param);
        res.json(val);
    }
}));

//kill a player
app.delete("/kill/:gameId/:target", wrapAsync(async (req, res) => {
    const status = await authenticatorFunc(req, res);
    if (status != 200) {
        res.sendStatus(status);
        res.json("Unauthorized");
    }
    else {
        const param = {
            gameId: req.params.gameId,
            target: req.params.target
        };
        const val = await killPlayer(param);
        res.json(val);
    }
}));

//insert a vote
app.put("/vote/:gameId/:user/:target", wrapAsync(async (req, res) => {
    const status = await authenticatorFunc(req, res);
    if (status != 200) {
        res.sendStatus(status);
        res.json("Unauthorized");
    }
    else {
        const param = {
            gameId: req.params.gameId,
            user: req.params.user,
            target: req.params.target
        };
        const val = await votePlayer(param);
        res.json(val);
    }
}));

//select a room
app.put("/room/:gameId/:user/:room", wrapAsync(async (req, res) => {
    const status = await authenticatorFunc(req, res);
    if (status != 200) {
        res.sendStatus(status);
        res.json("Unauthorized");
    }
    else {
        const param = {
            gameId: req.params.gameId,
            user: req.params.user,
            room: req.params.room
        };
        const val = await selectRoom(param);
        res.json(val);
    }
}));

//add a minigame score
app.post("/minigame/:gameId/:user/:score", wrapAsync(async (req, res) => {
    const status = await authenticatorFunc(req, res);
    if (status != 200) {
        res.sendStatus(status);
        res.json("Unauthorized");
    }
    else {
        const param = {
            gameId: req.params.gameId,
            user: req.params.user,
            score: parseInt(req.params.score, 10)
        };
        const val = await addMiniGameScore(param);
        res.json(val);
    }
}));

//initiate the ejection
app.post("/eject/:gameId", wrapAsync(async (req, res) => {
    const status = await authenticatorFunc(req, res);
    if (status != 200) {
        res.sendStatus(status);
        res.json("Unauthorized");
    }
    else {
        const param = {
            gameId: req.params.gameId,
        };
        const val = await ejectPlayer(param);
        res.json(val);
    }
}));

//start a new round
app.post("/newRound/:gameId", wrapAsync(async (req, res) => {
    const status = await authenticatorFunc(req, res);
    if (status != 200) {
        res.sendStatus(status);
        res.json("Unauthorized");
    }
    else {
        const param = {
            gameId: req.params.gameId,
        };
        const val = await newRound(param);
        res.json(val);
    }
}));

//create a new game
app.put("/newGame/:gameId/:user1", cors(corsO), wrapAsync(async (req, res) => {
    const status = await authenticatorFunc(req, res);
    if (status != 200) {
        res.sendStatus(status);
        res.json("Unauthorized");
    }
    else {
        const param = {
            gameId: req.params.gameId,
            user1: req.params.user1
        };
        const val = await createGame(param);
        res.json(val);
    }
}));

//fetch an attribute
app.get("/games/:gameId/:attr", wrapAsync(async (req, res) => {
    const status = await authenticatorFunc(req, res);
    if (status != 200) {
        res.sendStatus(status);
        res.json("Unauthorized");
    }
    else {
        const param = {
            gameId: req.params.gameId,
            attr: req.params.attr
        };
        const val = await fetchGame(param);
        res.json(val);
    }
}));

//add player
app.post("/games/addPlayer/:gameId/:username", wrapAsync(async (req, res) => {
    const status = await authenticatorFunc(req, res);
    if (status != 200) {
        res.sendStatus(status);
        res.json("Unauthorized");
    }
    else {
        const param = {
            gameId: req.params.gameId,
            username: req.params.username
        };
        const val = await addPlayer(param);
        res.json(val);
    }
}));

//app.use(function(error, req, res, next) {
//  res.status(400).json({message: error.message });
//});

module.exports = app;
