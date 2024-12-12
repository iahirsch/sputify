var express = require('express');
var router = express.Router();
var axios = require('axios');
var querystring = require('querystring');
require("dotenv").config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI || 'http://localhost:8080/callback';
const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';

router.get('/', async function (req, res) {
    console.log('callback from spotify...');

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies['spotify_auth_state'] : null;

    // Handle Error if no code is found
    if (!code) {
        return res.send("Authorization code not found.");
    }

    // Handle Error if state is invalid
    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie('spotify_auth_state');
        const authOptions = {
            method: 'POST',
            url: 'https://accounts.spotify.com/api/token',
            data: new URLSearchParams({
                code: code,
                redirect_uri: `${backendUrl}/callback`,
                grant_type: 'authorization_code'
            }).toString(),
            headers: {
                'Authorization': 'Basic ' + Buffer.from(
                    clientId + ':' + clientSecret
                ).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        try {
            // Request access token from Spotify
            const response = await axios.post(authOptions.url, authOptions.data, {
                headers: authOptions.headers
            });

            const access_token = response.data.access_token;
            const refresh_token = response.data.refresh_token;

            res.redirect(redirectUri + "?" +
                querystring.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token
                }));
        } catch (error) {
            console.error(
                "Invalid Token",
                error.response?.data || error.message
            );
            res.send("Failed to exchange authorization code for access token.");
        }
    }
});

module.exports = router;