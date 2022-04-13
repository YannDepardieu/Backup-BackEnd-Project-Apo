// const debug = require('debug')('router:api');
const express = require('express');
const { indexController } = require('../../controllers/api');
const commonRouter = require('./common');
const constellationRouter = require('./constellation');
const mythRouter = require('./myth');
const geocodingRouter = require('./geocoding');
const userRouter = require('./user');
const placeRouter = require('./place');
const eventRouter = require('./event');

const ApiError = require('../../errors/apiError');

const router = express.Router();

router.get('/test', indexController.test);

/**
 * Middleware that put a type on the future response, therefore the content-type will be json
 * It will be use later in case of error to send back a custom one
 * ExpressMiddleware signature
 * @param {object} _ Express request object (not used)
 * @param {object} res Express response object
 * @param {function} next Express next function
 * @return {function} send to the next middleware
 */
router.use((_, res, next) => {
    res.type('json');
    next();
});

/**
 * Default API route that handle all methods (GET, PUT, PATCH, DELETE, POST) to provide a documentation link
 * to help front developper when they forget to specify the routes
 * ALL v1/main-api/
 * @summary All verbs
 * @return {string} 200 - success response - application/json
 */
router.all('/', indexController.home);

// routes with basic CRUD operations for differents entities
router.use('/common', commonRouter);

// routes pour manage constellations
router.use('/constellation', constellationRouter);

// routes pour manage myths
router.use('/myth', mythRouter);

// routes to contact external geocoding API
router.use('/geocoding', geocodingRouter);

// routes to manage user's profile
router.use('/user', userRouter);

// routes to manage user's favorites places
router.use('/place', placeRouter);

// routes to manage user's reserved events
router.use('/event', eventRouter);

// By throwing an error, this middleware allows to go inside the 4 parameter middleware inside the index router
router.use(() => {
    throw new ApiError('API Route not found', { statusCode: 404 });
});

module.exports = router;
