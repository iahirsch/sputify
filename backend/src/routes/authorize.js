var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var crypto = require('crypto');
require("dotenv").config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const backendUrl = process.env.BACKEND_URL;

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

    // your application requests authorization
    const scope = 'streaming user-read-private user-read-email user-top-read user-read-playback-state user-read-currently-playing user-read-recently-played user-modify-playback-state playlist-read-private playlist-read-collaborative';
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        url: 'https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: clientId,
                scope: scope,
                redirect_uri: `${backendUrl}/callback`,
                state: state
            })
    })
    );
});

module.exports = router;