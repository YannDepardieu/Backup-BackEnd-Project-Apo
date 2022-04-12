const express = require('express');

const router = express.Router();
const { constellationController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');
const security = require('../../middlewares/security');
const validator = require('../../middlewares/validator');
const favConstSchema = require('../../schemas/createFavConst');

router
    .route('/:id(\\d+)')
    /**
     * GET /v1/api/constellation/{id}
     * @summary Get one constellation by its ID with its myth
     * @tags Constellation
     * @param {integer} id.path.required constellation identifier
     * @return {ConstellationMyth} 200 - success response - application/json
     */
    .get(asyncWrapper(constellationController.getByPkWithMyths));

router
    .route('/names')
    /**
     * GET /v1/api/constellation/names
     * @summary Get a list with all the constellations names
     * @tags Constellation
     * @return {object} 200 - success response - application/json
     */
    .get(asyncWrapper(constellationController.getAllNames));

router
    .route('/fav')
    /**
     * GET /v1/api/constellation/fav
     * @summary Get all user´s liked constellations
     * @tags Constellation
     * @security BearerAuth
     * @return {object} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     */
    .get(security.checkJWT, asyncWrapper(constellationController.getAllFavs))
    /**
     * POST /v1/api/constellation/fav
     * @summary Likes a constellation on user's favorite constellation list
     * @tags Constellation
     * @security BearerAuth
     * @param {integer} request.body.constellation_id Express req.object
     * @return {string} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     */
    .post(
        security.checkJWT,
        validator('body', favConstSchema),
        asyncWrapper(constellationController.likeConstellation),
    );

module.exports = router;
