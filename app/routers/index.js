const { Router } = require('express');
// const debug = require('debug')('main-router');

const apiRouter = require('./api');
const backofficeRouter = require('./backoffice');
const errorHandler = require('../middlewares/errorHandler');

const router = Router();

router.use('/api', apiRouter);

router.use('/backoffice', backofficeRouter);

/**
 * Object with all available and unavailable events
 * @typedef {object} jsonHTMLError
 * @property {number} statusCode the status code number
 * @property {string} message string with generated error
 * @property {string} error string with status code
 */
/**
 * ExpressMiddleware signature
 * @summary Special errors middleware in which you go only if an error is thrown (throw new Error)
 * @tags errors
 * @param {object} err Express error object
 * @param {object} _ Express request object (not used)
 * @param {object} res Express response object
 * @return {jsonHTMLError} HTML or JSON error response depending on the error
 */
router.use((err, _, response, next) => {
    errorHandler(err, response, next);
});

/**
 * Ici il est important de laisser les 4 params même si on ne les utilise pas tous,
 * sinon on ne rentrera pas dedans en cas d'erreur.
 * Final middleware that catches all wrong routes where there is no error thrown
 * ExpressMiddleware signature
 * @param {object} _ Express request object (not used)
 * @param {object} res Express response object
 * @returns {string} JSON error response
 */
router.use((_, res) => {
    res.status(404).json({ name: 'General', version: '1.0', status: 404, message: 'not_found' });
});

module.exports = router;
