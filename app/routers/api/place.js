const express = require('express');

const router = express.Router();
const { placeController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');
const security = require('../../middlewares/security');
const validator = require('../../middlewares/validator');
const createPlaceSchema = require('../../schemas/createPlace');
const updatePlaceSchema = require('../../schemas/updatePlace');

router
    .route('/')
    /**
     * POST /v1/api/place
     * @summary Insert a place and insert favorite place to bind the place to the user
     * @tags Place
     * @security BearerAuth
     * @param {PlaceInput} request.body.required Express req.object
     * @return {PlaceOutput} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     * @return {ApiError} 400 - Bad Request : Input data is not in the valid format - application/json
     * @return {ApiError} 404 - Cannot find a location for this address - application/json
     */
    .post(
        security.checkJWT,
        validator('body', createPlaceSchema),
        asyncWrapper(placeController.insert),
    )
    /**
     * GET /v1/api/place
     * @summary Gets all user's favorites places
     * @tags Place
     * @security BearerAuth
     * @return {array<PlaceOutput>} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     */
    .get(security.checkJWT, asyncWrapper(placeController.selectAll));

router
    .route('/:id(\\d+)')
    /**
     * GET /v1/api/place{id}
     * @summary Select a user's place by its userId and placeId
     * @tags Place
     * @security BearerAuth
     * @param {integer} id.path.required place primary key
     * @return {PlaceOutput} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     * @return {ApiError} 404 - Place not found for this placeId and this userId - application/json
     */
    .get(security.checkJWT, asyncWrapper(placeController.selectByPk))
    /**
     * PATCH /v1/api/place{id}
     * @summary Update user's place by its userId and placeId
     * @tags Place
     * @param {integer} id.path.required place primary key
     * @param {PlaceInput} request.body.required Express req.object
     * @return {PlaceOutput} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     * @return {ApiError} 400 - Bad Request : Input data is not in the valid format - application/json
     * @return {ApiError} 404 - Cannot find a location for this address - application/json
     * @return {ApiError} 404 - Place to update not found for this placeId and this userId - application/json
     */
    .patch(
        security.checkJWT,
        validator('body', updatePlaceSchema),
        asyncWrapper(placeController.update),
    )
    /**
     * DELETE /v1/api/place{id}
     * @summary Delete user's place by its userId and placeId
     * @tags Place
     * @security BearerAuth
     * @param {integer} id.path.required place primary key
     * @return {boolean} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     * @return {ApiError} 404 - Place to delete not found for this placeId and this userId - application/json
     */
    .delete(security.checkJWT, asyncWrapper(placeController.delete));

module.exports = router;
