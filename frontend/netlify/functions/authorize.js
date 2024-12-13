const querystring = require('querystring');
const crypto = require('crypto');
require("dotenv").config();

const clientId = process.env.SPOTIFY_CLIENT_ID;

const generateRandomString = (length) => {
    return crypto
        .randomBytes(60)
        .toString('hex')
        .slice(0, length);
}

exports.handler = async function (event, context) {
    const stateKey = 'spotify_auth_state';
    const state = generateRandomString(16);

    const scope = 'streaming user-read-private user-read-email user-top-read user-read-playback-state user-read-currently-playing user-read-recently-played user-modify-playback-state playlist-read-private playlist-read-collaborative';

    const url = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: process.env.REDIRECT_URI,
            state: state
        });

    return {
        statusCode: 200,
        headers: {
            'Set-Cookie': `${stateKey}=${state}; HttpOnly`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    };
};