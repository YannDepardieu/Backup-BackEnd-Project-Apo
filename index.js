const debug = require('debug')('Express:Server');

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const router = require('./app/routers');

// on crée un serveur http
const server = express();
// on utilise l'opérateur OU pour mettre une valeur par défaut si rien n'est défini dans le .env
const PORT = process.env.PORT || 3000;

server.set('view engine', 'pug');
server.set('views', './app/views');

server.use(express.static('./static'));

// je spécifie ma politique de cors : nécessaire pour pouvoir appeler mon api depuis une autre origine avec fetch
// On expose le header “Authorization” (sera utile plus tard pour récupérer le JWtoken d’authentification côté client)
const corsOptions = {
    exposedHeaders: ['Authorization'],
    origin: '*', // en mettant * j'autorise toutes les origines
    // origin: 'http://localhost:3000/'
};

server.use(cors(corsOptions));

// le middleware pour alimenter req.body avec les informations passées dans le corps de la requete parsées
server.use(express.urlencoded({ extended: true }));
// on peut ajouter un 2ème middleware pour comprendre d'autres formats de corps de requete et alimenter toujours req.body
server.use(express.json());

// permet de faire comprendre à express le format FormData
// on utlise .none() pour dire qu'on attends pas de fichier, uniquement des inputs "classiques" !

server.use('/v1', router);

server.listen(PORT, () => {
    debug(`✅ Server listening on http://localhost:${PORT} ✅`);
});
