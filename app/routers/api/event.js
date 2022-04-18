const express = require('express');

const router = express.Router();
const { eventController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');
const security = require('../../middlewares/security');
const validator = require('../../middlewares/validator');
const createEventSchema = require('../../schemas/createEvent');
const updateEventSchema = require('../../schemas/updateEvent');

router
    .route('/')
    /**
     * POST /v1/api/event/
     * @summary Insert one event and insert reserve_table to bind the event to the user
     * @tags Event
     * @security BearerAuth
     * @param {EventInput} request.body.required Express req.object
     * @return {EventOutput} 201 - Event created - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     * @return {ApiError} 400 - Bad Request : Input data is not in the valid format - application/json
     * @return {ApiError} 404 - Cannot find a location for this address - application/json
     */
    .post(
        security.checkJWT,
        validator('body', createEventSchema),
        asyncWrapper(eventController.insert),
    )
    /**
     * GET /v1/api/event/
     * @summary Select all events of a user
     * @tags Event
     * @security BearerAuth
     * @return {array<EventOutput>} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     */
    .get(security.checkJWT, asyncWrapper(eventController.selectAll));

router
    .route('/:id(\\d+)')
    /**
     * GET /v1/api/event/{id}
     * @summary Select a user's event by its userId and eventId
     * @tags Event
     * @security BearerAuth
     * @param {integer} id.path.required event primary key
     * @return {EventOutput} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     * @return {ApiError} 404 - Event not found for this eventId and this userId - application/json
     */
    .get(security.checkJWT, asyncWrapper(eventController.selectByPk))
    /**
     * PATCH /v1/api/event/{id}
     * @summary Update a user's event by its userId and eventId
     * @tags Event
     * @security BearerAuth
     * @param {integer} id.path.required event primary key
     * @param {EventInput} request.body.required Express req.object
     * @return {EventOutput} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     * @return {ApiError} 400 - Bad Request : Input data is not in the valid format - application/json
     * @return {ApiError} 404 - Cannot find a location for this address - application/json
     * @return {ApiError} 404 - Event to update not found for this eventId and this userId - application/json
     */
    .patch(
        security.checkJWT,
        validator('body', updateEventSchema),
        asyncWrapper(eventController.update),
    )
    /**
     * DELETE /v1/api/event/{id}
     * @summary Delete a user's event by its userId and eventId
     * @tags Event
     * @security BearerAuth
     * @param {integer} id.path.required event primary key
     * @return {boolean} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     * @return {ApiError} 404 - Event to delete not found for this eventId and this userId - application/json
     */
    .delete(security.checkJWT, asyncWrapper(eventController.delete));

module.exports = router;
