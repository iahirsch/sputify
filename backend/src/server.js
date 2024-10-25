const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI || 'http://localhost:8080/callback';

app.use(bodyParser.json());
app.use(cors());

// Utility function to encode base64 for client credentials
const encodeClientCredentials = () => {
    const buffer = Buffer.from(`${clientId}:${clientSecret}`);
    return buffer.toString('base64');
};

// Generate random string for state
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(crypto.randomBytes(length))
        .map((val) => possible[val % possible.length])
        .join('');
};

app.get('/', (req, res) => {
    res.send('Hello from the Backend!');
});

// Endpoint to handle authorization URL generation
app.get('/api/spotify/authorize', (req, res) => {
    const scope = 'streaming user-read-private user-read-email user-top-read user-read-playback-state user-modify-playback-state playlist-read-private playlist-read-collaborative';
    const state = generateRandomString(16);
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        redirect_uri: redirectUri,
        state
    };

    authUrl.search = new URLSearchParams(params).toString();
    res.json({ authUrl: authUrl.toString() });
});

// Endpoint to exchange authorization code for tokens
app.post('/api/spotify/exchange-token', async (req, res) => {
    const { code, codeVerifier } = req.body;

    const tokenPayload = new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier
    });

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', tokenPayload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${encodeClientCredentials()}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error exchanging tokens:', error.response?.data || error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to refresh access token using refresh token
app.post('/api/spotify/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;

    const refreshPayload = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId
    });

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', refreshPayload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${encodeClientCredentials()}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error refreshing token:', error.response?.data || error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to fetch user information
app.get('/api/spotify/user-info', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Missing authorization token');
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching user info:', error.response?.data || error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to fetch wrapped playlists
app.get('/api/spotify/wrapped-playlists', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Missing authorization token');
    }

    try {
        const wrappedPlaylists = [
            { id: '37i9dQZF1Fa1IIVtEpGUcU', year: 2023 },
            { id: '37i9dQZF1F0sijgNaJdgit', year: 2022 },
            { id: '37i9dQZF1EUMDoJuT8yJsl', year: 2021 },
            // Add more playlist IDs as needed
        ];

        const playlists = await Promise.all(
            wrappedPlaylists.map(async ({ id, year }) => {
                try {
                    const response = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    return { id, year, playlist: response.data };
                } catch {
                    return { id, year, playlist: null };
                }
            })
        );

        res.json({ playlists });
    } catch (error) {
        console.error('Error fetching wrapped playlists:', error.response?.data || error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});