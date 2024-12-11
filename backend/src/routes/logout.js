var express = require('express');
var router = express.Router();
require("dotenv").config();

router.get('/', function (req, res) {
    res.clearCookie('spotify_auth_state');

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.status(200).json({ message: 'Logged out' });
});

module.exports = router;