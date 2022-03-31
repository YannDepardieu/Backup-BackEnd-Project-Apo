// const debug = require('debug')('router:api');
const express = require('express');
const apiController = require('../../controllers/api');
const apiRouter = require('./api');
const ApiError = require('../../errors/apiError');

const router = express.Router();

router.get('/test', apiController.test);

// En fait, on dit que pour toutes les routes de l'api, on met un response content-type en json
// Et puis on se base sur ça pour adapter le format de réponse de l'erreur
/**
 * Middleware that put a type on the future response
 * ExpressMiddleware signature
 * @param {object} _ Express request object (not used)
 * @param {object} res Express response object
 * @param {function} next Express next function
 * @returns {function} send to the next middleware
 */
router.use((_, res, next) => {
    res.type('json');
    next();
});

/**
 * Default API route that handle all methods (GET, PUT, PATCH, DELETE, POST) tp provide a documentation link
 * to help front developper when they forget to specify the routes
 * ALL v1/main-api/
 * @summary All verbs
 * @tags all
 * @return {string} 200 - success response - application/json
 */
router.all('/', apiController.home);

router.use('/api', apiRouter);

// Gestion erreurs :Pour entrer dans le middleware handleError à 4 paramètres (error, request, response, next)
// il faut throw une erreur qq part avant. Ici on traverse donc ce middleware et on va dans handleError
router.use(() => {
    throw new ApiError('API Route not found', { statusCode: 404 });
});

module.exports = router;
