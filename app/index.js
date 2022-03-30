const path = require('path');
const express = require('express');
const cors = require('cors');

const router = require('./routers');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('./static'));

// je spécifie ma politique de cors : nécessaire pour pouvoir appeler mon api depuis une autre origine avec fetch
// On expose le header “Authorization” (sera utile plus tard pour récupérer le JWtoken d’authentification côté client)
const corsOptions = {
    exposedHeaders: ['Authorization'],
    origin: '*', // en mettant * j'autorise toutes les origines
    // origin: 'http://localhost:3000/'
};

app.use(cors(corsOptions));

// On active le middleware pour parser le payload urlencoded et alimenter req.body
app.use(express.urlencoded({ extended: true }));
// On active le middleware pour parser le payload JSON et alimenter req.body
app.use(express.json());

app.use('/v1', router);

module.exports = app;
