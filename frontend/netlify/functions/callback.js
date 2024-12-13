const axios = require('axios');
const querystring = require('querystring');
require("dotenv").config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

exports.handler = async function (event, context) {
    const code = event.queryStringParameters.code || null;
    const state = event.queryStringParameters.state || null;
    const storedState = event.headers.cookie ? event.headers.cookie.split('; ').find(row => row.startsWith('spotify_auth_state')).split('=')[1] : null;

    if (!code) {
        return {
            statusCode: 400,
            body: "Authorization code not found."
        };
    }

    if (state === null || state !== storedState) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'state_mismatch' })
        };
    }

    const authOptions = {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        data: new URLSearchParams({
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        }).toString(),
        headers: {
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    try {
        const response = await axios.post(authOptions.url, authOptions.data, {
            headers: authOptions.headers
        });

        const access_token = response.data.access_token;
        const refresh_token = response.data.refresh_token;

        return {
            statusCode: 302,
            headers: {
                'Location': `${redirectUri}?${querystring.stringify({ access_token, refresh_token })}`
            },
            body: ''
        };
    } catch (error) {
        console.error("Invalid Token", error.response?.data || error.message);
        return {
            statusCode: 500,
            body: "Failed to exchange authorization code for access token."
        };
    }
};