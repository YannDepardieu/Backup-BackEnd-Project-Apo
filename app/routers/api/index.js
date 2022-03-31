// const debug = require('debug')('router:api');
const express = require('express');
const apiController = require('../../controllers/api');
const apiRouter = require('./api');

const router = express.Router();

router.get('/test', apiController.test);

router.use((_, res, next) => {
    res.type('json');
    next();
});

// Route par défaut de l'API, configurée pour toutes les méthodes (tous les verbs GET, PUT, PATCH, DELETE, POST)
// afin de donner l'information en cas d'oubli de spéfication de la route par l'utilisateur
router.all('/', apiController.home);

router.use('/api', apiRouter);

module.exports = router;
