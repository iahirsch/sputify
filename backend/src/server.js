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
    origin: 'http://https://sputify-backend.onrender.com',
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

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;