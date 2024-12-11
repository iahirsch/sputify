var express = require('express');
var router = express.Router();
require("dotenv").config();
var querystring = require('querystring');

router.get('/', function (req, res) {
    console.log('logging out...');
    res.clearCookie('spotify_auth_state');

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.status(200).json({ message: 'Logged out' });
});

module.exports = router;