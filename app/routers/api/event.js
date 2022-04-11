const express = require('express');

const router = express.Router();
const { eventController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');
const security = require('../../middlewares/security');
const validator = require('../../middlewares/validator');
const createSchema = require('../../schemas/createEvent');

router
    .route('/')
    /**
     * POST /v1/api/event/
     * @summary Insert one event et insert reserve_table to bind the event to the user
     * @tags Event
     * @param {EventInput} request.body.required Express req.object
     * @security BearerAuth
     * @return {EventOutput} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Entities no found - application/json
     */
    .post(security.checkJWT, validator('body', createSchema), asyncWrapper(eventController.create));

module.exports = router;
