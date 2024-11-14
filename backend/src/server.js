const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');
const cookieParser = require('cookie-parser')
var querystring = require('querystring');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI || 'http://localhost:8080/callback';

app.use(bodyParser.json());
app.use(cors(({ credentials: true, origin: 'http://localhost:5173' })));
app.use(cookieParser());

const generateRandomString = (length) => {
    return crypto
        .randomBytes(60)
        .toString('hex')
        .slice(0, length);
}

var stateKey = 'spotify_auth_state';

app.get('/api/spotify/authorize', function (req, res) {
    console.log('authorizing with spotify...');
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    const scope = 'streaming user-read-private user-read-email user-top-read user-read-playback-state user-modify-playback-state playlist-read-private playlist-read-collaborative';
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        url: 'https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: clientId,
                scope: scope,
                redirect_uri: redirectUri,
                state: state
            })
    }));
});

app.get('/api/spotify/callback', async function (req, res) {
    console.log('callback from spotify...');

    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        console.log('state mismatch');
        console.log('state: ' + state);
        console.log('storedState: ' + storedState);
        res.status(400).json({ error: 'state_mismatch' });
    } else {
        console.log('state match');
        //res.clearCookie(stateKey);

        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64'))
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
            }),
        }

        let access_token_response = await fetch('https://accounts.spotify.com/api/token', payload);
        let data = await access_token_response.json();

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));

    }
});

app.get('/api/spotify/refresh_token', async function (req, res) {
    const refresh_token = req.query.refresh_token;
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64'))
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        }),
    }

    let access_token_response = await fetch('https://accounts.spotify.com/api/token', payload);
    let data = await access_token_response.json();

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));

    /*
        var refresh_token = req.query.refresh_token;
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64'))
            },
            form: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            json: true
        };
    
        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token,
                    refresh_token = body.refresh_token;
                res.send({
                    'access_token': access_token,
                    'refresh_token': refresh_token
                });
            }
        });
        */
});


// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});