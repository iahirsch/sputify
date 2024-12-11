const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));

// Define Routes
var authorizeRouter = require('./routes/authorize');
var callbackRouter = require('./routes/callback');
var analyzeRouter = require('./routes/analyze');
var logoutRouter = require('./routes/logout');

app.use('/authorize', authorizeRouter);
app.use('/callback', callbackRouter);
app.use('/analyze', analyzeRouter);
app.use('/logout', logoutRouter);

const port = process.env.PORT || 3000;

/*
app.get('/api/spotify/callback', async function (req, res) {
    console.log('callback from spotify...');

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies['spotify_auth_state'] : null;

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
*/

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;