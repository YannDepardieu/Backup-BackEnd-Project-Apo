const express = require('express');

const router = express.Router();
const { constellationController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');
const security = require('../../middlewares/security');
const validator = require('../../middlewares/validator');
const favConstSchema = require('../../schemas/createFavConst');

router
    .route('/')
    /**
     * GET /v1/api/constellation/
     * @summary Select all constellations with attributes (Myths, Stars, Galaxies)
     * @tags Constellation
     * @return {array<ConstellationWithAttributesOutput>} 200 - success response - application/json
     */
    .get(asyncWrapper(constellationController.selectAll));

router
    .route('/:id(\\d+)')
    /**
     * GET /v1/api/constellation/{id}
     * @summary Select one constellation by its ID with attributes (Myths, Stars, Galaxies)
     * @tags Constellation
     * @param {integer} id.path.required constellation primary key
     * @return {ConstellationWithAttributesOutput} 200 - success response - application/json
     * @return {ApiError} 404 - Constellation not found for this id - application/json
     */
    .get(asyncWrapper(constellationController.selectByPk));

router
    .route('/names')
    /**
     * GET /v1/api/constellation/names
     * @summary Select all the constellations names
     * @tags Constellation
     * @return {array<ConstellationNameOutput>} 200 - success response - application/json
     */
    .get(asyncWrapper(constellationController.selectAllNames));

router
    .route('/favorite')
    /**
     * POST /v1/api/constellation/favorite
     * @summary Add a constellation on user's favorite constellation list
     * @tags Constellation
     * @security BearerAuth
     * @param {ConstellationAddFavoriteInput} request.body.required Express req.object
     * @return {boolean} 201 - New row created in favorite_constellation - application/json
     * @return {ApiError} 401 - Unauthorized Authentification needed - application/json
     * @return {ApiError} 400 - Input data is not validated - application/json
     * @return {ApiError} 400 - Constellation already in favorite for this userId - application/json
     * @return {ApiError} 404 - Constellation not found for this id - application/json
     */
    .post(
        security.checkJWT,
        validator('body', favConstSchema),
        asyncWrapper(constellationController.insertFavorite),
    )
    /**
     * GET /v1/api/constellation/favorite
     * @summary Select all user´s favorites constellations
     * @tags Constellation
     * @security BearerAuth
     * @return {array<ConstellationWithAttributesOutput>} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized Authentification needed - application/json
     */
    .get(security.checkJWT, asyncWrapper(constellationController.selectAllFavorites));

router
    .route('/favorite/:id(\\d+)')
    /**
     * DELETE /v1/api/constellation/favorite/{id}
     * @summary Delete a constellation from user's favorites
     * @tags Constellation
     * @security BearerAuth
     * @param {integer} id.path.required constellation primary key
     * @return {boolean} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized Authentification needed - application/json
     * @return {ApiError} 404 - Constellation to delete from favorite not found for this constellationId and this userId - application/json
     */
    .delete(security.checkJWT, asyncWrapper(constellationController.deleteFavorite));

module.exports = router;
