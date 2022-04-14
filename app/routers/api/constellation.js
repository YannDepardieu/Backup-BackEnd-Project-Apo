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
     * @return {object} 200 - success response - application/json
     */
    .get(asyncWrapper(constellationController.selectAll));

router
    .route('/:id(\\d+)')
    /**
     * GET /v1/api/constellation/{id}
     * @summary Select one constellation by its ID with attributes (Myths, Stars, Galaxies)
     * @tags Constellation
     * @param {integer} id.path.required constellation identifier
     * @return {ConstellationMyth} 200 - success response - application/json
     */
    .get(asyncWrapper(constellationController.selectByPk));

router
    .route('/names')
    /**
     * GET /v1/api/constellation/names
     * @summary Select all the constellations names
     * @tags Constellation
     * @return {object} 200 - success response - application/json
     */
    .get(asyncWrapper(constellationController.selectAllNames));

router
    .route('/favorites')
    /**
     * POST /v1/api/constellation/favorites
     * @summary Add a constellation on user's favorite constellation list
     * @tags Constellation
     * @security BearerAuth
     * @param {integer} request.body.constellation_id Express req.object
     * @return {string} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     */
    .post(
        security.checkJWT,
        validator('body', favConstSchema),
        asyncWrapper(constellationController.insertFavorite),
    )
    /**
     * GET /v1/api/constellation/favorites
     * @summary Select all user´s favorites constellations
     * @tags Constellation
     * @security BearerAuth
     * @return {object} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     */
    .get(security.checkJWT, asyncWrapper(constellationController.selectAllFavorites));

router
    .route('favorites/:id(\\d+)')
    /**
     * DELETE /v1/api/constellation/favorites/{id}
     * @summary Delete a constellation from user's favorites
     * @tags Constellation
     * @security BearerAuth
     * @param {integer} id.path.required constellation identifier
     * @return {string} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     */
    .delete(security.checkJWT, asyncWrapper(constellationController.deleteFavorite));

module.exports = router;
