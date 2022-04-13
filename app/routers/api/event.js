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
     * @param {CreatedEventInput} request.body.required Express req.object
     * @return {CreatedEventOutput} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Entities no found - application/json
     */
    .post(security.checkJWT, validator('body', createSchema), asyncWrapper(eventController.create))
    /**
     * POST /v1/api/event/
     * @summary Get all events of a user
     * @tags Event
     * @security BearerAuth
     * @return {GetAllEvents} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Entities no found - application/json
     */
    .get(security.checkJWT, asyncWrapper(eventController.getAll));

router
    .route('/:id(\\d+)')
    /**
     * GET /v1/api/event/{id}
     * @summary Get one event of a user by its userId and eventId
     * @tags Event
     * @security BearerAuth
     * @param {integer} id.path.required identifier
     * @return {GetOneEvent} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Entities no found - application/json
     */
    .get(security.checkJWT, asyncWrapper(eventController.getByPk))
    /**
     * PATCH /v1/api/event/{id}
     * @summary Update an event of a user by its userId and eventId
     * @tags Event
     * @security BearerAuth
     * @param {integer} id.path.required identifier
     * @param {EventToUpdate} request.body.required Express req.object
     * @return {EventUpdated} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Entities no found - application/json
     */
    .patch(
        security.checkJWT,
        validator('body', updateSchema),
        asyncWrapper(eventController.update),
    );

module.exports = router;
