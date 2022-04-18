const path = require('path');
const express = require('express');
const cors = require('cors');

const router = require('./routers');

const app = express();
require('./helpers/apiDocs')(app);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('./static'));

// Specify CORS policy : needed to be able to call the app from another origin with fetch
// Exposing the header “Authorization” that will be needed to get back the authentification token on the front side
const corsOptions = {
    exposedHeaders: ['Authorization'],
    origin: '*', // " * " Allows all origins
    // To get more restriction, we can put something like : origin: 'http://localhost:3000/'
};

app.use(cors(corsOptions));
// Parsing the urlencoded payload to get req.body with data inside
app.use(express.urlencoded({ extended: true }));
// Parsing the JSON payload to get req.body with data inside
app.use(express.json());

app.use('/v1', router);

module.exports = app;
