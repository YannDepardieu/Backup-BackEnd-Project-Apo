const debug = require('debug')('db:postgres:sql');

// Plutôt que créer et connecter un Client on va plutôt créer un "pool" de client et laisser notre module manager
// les connexions de plusieurs client en fonction des besoins.

// tableau de client, on va pouvoir exécuter plusieurs requêtes
const { Pool } = require('pg');

const config = {
    connectionString: process.env.DATABASE_URL,
};

if (process.env.NODE_ENV === 'production') {
    // petit truc de config pour la version en prod sur heroku
    // ça nous évitera des messages d'erreurs concernant ssl
    config.ssl = {
        rejectUnauthorized: false,
    };
}

const pool = new Pool(config);

pool.connect((err) => (err ? debug(`ERREUR${err}`) : debug('DB connectée')));

module.exports = {
    // On expose quand même le client original "au cas ou"
    originalClient: pool,

    // On fait une méthode pour "intercepter" les requêtes afin de pouvoir les afficher
    // L'opérateur de "rest" permet de transformer ici X variables en param. en un tableau
    async query(...params) {
        debug(...params);
        // L'opérateur ici fait l'effet inverse on transforme un tableau en une liste de variables / paramétre ce
        // qui fait que la méthode query du client sera appelé exactement de la même façon que celle de notre module
        return this.originalClient.query(...params);
    },
};
