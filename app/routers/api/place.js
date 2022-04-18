const express = require('express');

const router = express.Router();
const { placeController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');
const security = require('../../middlewares/security');
const validator = require('../../middlewares/validator');
const userPlaceSchema = require('../../schemas/createUserPlace');

router
    .route('/')
    /**
     * POST /v1/api/place
     * @summary Insert a place and insert user's favorite place
     * @tags Place
     * @security BearerAuth
     * @return {Place} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     * @return {ApiError} 400 - Bad Request : Input data is not in the valid format - application/json
     * @return {ApiError} 404 - Cannot find a location for this address - application/json
     */
    .post(
        security.checkJWT,
        validator('body', userPlaceSchema),
        asyncWrapper(placeController.insert),
    )
    /**
     * GET /v1/api/place
     * @summary Gets all user's favorites places
     * @tags Place
     * @security BearerAuth
     * @return {array<Place>} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     */
    .get(security.checkJWT, asyncWrapper(placeController.selectAll));

router
    .route('/:id(\\d+)')
    /**
     * GET /v1/api/place{id}
     * @summary Gets all user's favorites places
     * @tags Place
     * @security BearerAuth
     * @param {integer} id.path.required identifier
     * @return {Place} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     * @return {ApiError} 404 - Place not found for this placeId and this userId - application/json
     */
    .get(security.checkJWT, asyncWrapper(placeController.selectByPk))
    /**
     * PATCH /v1/api/place{id}
     * @summary Updates one user's favorite place
     * @tags Place
     * @param {integer} id.path.required identifier
     * @return {Place} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     * @return {ApiError} 400 - Bad Request : Input data is not in the valid format - application/json
     * @return {ApiError} 404 - Cannot find a location for this address - application/json
     * @return {ApiError} 404 - Place to update not found for this placeId and this userId - application/json
     */
    .patch(security.checkJWT, asyncWrapper(placeController.update))
    /**
     * DELETE /v1/api/place{id}
     * @summary Deletes one user's favorite place
     * @tags Place
     * @security BearerAuth
     * @param {integer} id.path.required identifier
     * @return {string} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     * @return {ApiError} 404 - Place to delete not found for this placeId and this userId - application/json
     */
    .delete(security.checkJWT, asyncWrapper(placeController.delete));

module.exports = router;
