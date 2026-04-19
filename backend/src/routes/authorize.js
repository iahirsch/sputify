var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var crypto = require('crypto');
require("dotenv").config();

const clientId = process.env.SPOTIFY_CLIENT_ID;

const generateRandomString = (length) => {
    return crypto
        .randomBytes(60)
        .toString('hex')
        .slice(0, length);
}

var stateKey = 'spotify_auth_state';

router.get('/', function (req, res) {
    console.log('authorizing with spotify...');

    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope = 'streaming user-read-private user-read-email user-top-read user-read-playback-state user-read-currently-playing user-read-recently-played user-modify-playback-state playlist-read-private playlist-read-collaborative';

    const authUrl = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: "http://127.0.0.1:3000/callback",
            state: state
        });

    res.redirect(authUrl);
});

module.exports = router;