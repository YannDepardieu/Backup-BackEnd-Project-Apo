const express = require('express');

const router = express.Router();
const { eventController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');
const security = require('../../middlewares/security');
const validator = require('../../middlewares/validator');
const createSchema = require('../../schemas/createEvent');
const updateSchema = require('../../schemas/updateEvent');

router
    .route('/')
    /**
     * POST /v1/api/event/
     * @summary Insert one event et insert reserve_table to bind the event to the user
     * @tags Event
     * @security BearerAuth
     * @param {EventInput} request.body.required Express req.object
     * @return {EventOutput} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Event not found - application/json
     */
    .post(security.checkJWT, validator('body', createSchema), asyncWrapper(eventController.insert))
    /**
     * GET /v1/api/event/
     * @summary Select all events of a user
     * @tags Event
     * @security BearerAuth
     * @return {array<EventOutput>} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Event not found - application/json
     */
    .get(security.checkJWT, asyncWrapper(eventController.selectAll));

router
    .route('/:id(\\d+)')
    /**
     * GET /v1/api/event/{id}
     * @summary Select one event of a user by its userId and eventId
     * @tags Event
     * @security BearerAuth
     * @param {integer} id.path.required event identifier
     * @return {EventOutput} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Event not found - application/json
     */
    .get(security.checkJWT, asyncWrapper(eventController.selectByPk))
    /**
     * PATCH /v1/api/event/{id}
     * @summary Update an event of a user by its userId and eventId
     * @tags Event
     * @security BearerAuth
     * @param {integer} id.path.required event identifier
     * @param {EventInput} request.body.required Express req.object
     * @return {EventOutput} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Event not found - application/json
     */
    .patch(security.checkJWT, validator('body', updateSchema), asyncWrapper(eventController.update))
    /**
     * DELETE /v1/api/event/{id}
     * @summary Delete an event of a user by its userId and eventId
     * @tags Event
     * @security BearerAuth
     * @param {integer} id.path.required event identifier
     * @return {object} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Event not found - application/json
     */
    .delete(security.checkJWT, asyncWrapper(eventController.delete));

module.exports = router;
