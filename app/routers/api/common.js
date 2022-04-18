const express = require('express');

const router = express.Router();
const { commonController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');
const getModel = require('../../middlewares/getModel');
const commonValidator = require('../../middlewares/commonValidator');
const security = require('../../middlewares/security');

router.use(
    '/:entity(constellation|myth|planet|star|place|event|reserve_event|save_place|favorite_constellation|prefer_planet)',
    getModel,
);

router
    .route(
        '/:entity(constellation|myth|planet|star|place|event|reserve_event|save_place|favorite_constellation|prefer_planet)',
    )
    /**
     * POST /v1/api/common/{entity}
     * @tags Entities routes
     * @summary Insert one entity entry
     * @security BearerAuth
     * @param {string} entity.path.required Entities availables: constellation, myth, planet, star, user
     * @param {Constellation|Event|Myth|Place|Planet|Star} request.body Express req.object
     * @return {Constellation|Event|Myth|Place|Planet|Star} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     * @return {ApiError} 400 - Bad Request : Input data is not in the valid format - application/json
     * @return {ApiError} 400 - Bad Request : This new entry is not unique - application/json
     */
    .post(security.checkJWT, commonValidator('body'), asyncWrapper(commonController.insert));

router
    .route('/:entity(constellation|myth|planet|star)')
    /**
     * GET /v1/api/common/{entity}
     * @tags Entities routes
     * @summary Select all entries for an entity
     * @param {string} entity.path.required entities availables: constellation, myth, planet, star, user
     * @return {array<Constellation>|array<Myth>|array<Planet>|array<Star>} 200 - success response - application/json
     */
    .get(asyncWrapper(commonController.selectAll));

router
    .route('/:entity(constellation|myth|planet|star)/:id(\\d+)')
    /**
     * GET /v1/api/common/{entity}/{id}
     * @tags Entities routes
     * @summary Select one entity entry by its ID
     * @param {string} entity.path.required entities availables: constellation, event, myth, place, planet, star, user
     * @param {integer} id.path.required identifier
     * @return {Constellation|Event|Myth|Place|Planet|Star} 200 - success response - application/json
     * @return {ApiError} 404 - No data found for this id - application/json
     */
    .get(asyncWrapper(commonController.selectByPk));

router
    .route(
        `/:entity(constellation|myth|planet|star|place|event|reserve_event|save_place|favorite_constellation|prefer_planet)
        /:id(\\d+)`,
    )
    /**
     * PATCH /v1/api/common/{entity}/{id}
     * @tags Entities routes
     * @summary Update one entity entry by its ID
     * @security BearerAuth
     * @param {string} entity.path.required entities availables: constellation, event, myth, place, planet, star, user
     * @param {integer} id.path.required identifier
     * @return {Constellation|Event|Myth|Place|Planet|Star} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     * @return {ApiError} 400 - Bad Request : Input data is not in the valid format - application/json
     * @return {ApiError} 404 - No data for this id - application/json
     * @return {ApiError} 400 - Bad Request : This new entry is not unique - application/json
     */
    .patch(security.checkJWT, commonValidator('body'), asyncWrapper(commonController.update))
    /**
     * DELETE /v1/api/common/{entity}/{id}
     * @tags Entities routes
     * @summary Delete one entity entry by its ID
     * @security BearerAuth
     * @param {string} entity.path.required entities availables: constellation, event, myth, place, planet, star, user
     * @param {integer} id.path.required identifier
     * @return {Constellation|Event|Myth|Place|Planet|Star} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     * @return {ApiError} 404 - No data for this id - application/json
     */
    .delete(security.checkJWT, asyncWrapper(commonController.delete));

module.exports = router;
