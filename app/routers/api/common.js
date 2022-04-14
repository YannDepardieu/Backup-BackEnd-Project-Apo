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
    .route('/:entity(constellation|myth|planet|star)')
    /**
     * GET /v1/api/common/{entity}
     * @summary Get all entries for an entity
     * @tags Entities routes
     * @param {string} entity.path.required entities availables: constellation, myth, planet, star, user
     * @return {array<Constellation>|array<Myth>|array<Planet>|array<Star>} 200 - success response - application/json
     */
    .get(asyncWrapper(commonController.selectAll));

router
    .route(
        '/:entity(constellation|myth|planet|star|place|event|reserve_event|save_place|favorite_constellation|prefer_planet)',
    )
    /**
     * POST /v1/api/common/{entity}
     * @summary Create one entity entry
     * @tags Entities routes
     * @security BearerAuth
     * @param {string} entity.path.required Entities availables: constellation, myth, planet, star, user
     * @param {Constellation|Event|Myth|Place|Planet|Star} request.body Express req.object
     * @return {Constellation|Event|Myth|Place|Planet|Star} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     */
    .post(security.checkJWT, commonValidator('body'), asyncWrapper(commonController.insert));

router
    .route('/:entity(constellation|myth|planet|star)/:id(\\d+)')
    /**
     * GET /v1/api/common/{entity}/{id}
     * @summary Get one entity entry by its ID
     * @tags Entities routes
     * @param {string} entity.path.required entities availables: constellation, event, myth, place, planet, star, user
     * @param {integer} id.path.required identifier
     * @return {Constellation|Event|Myth|Place|Planet|Star} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Entities no found - application/json
     */
    .get(asyncWrapper(commonController.selectByPk));

router
    .route(
        `/:entity(constellation|myth|planet|star|place|event|reserve_event|save_place|favorite_constellation|prefer_planet)
        /:id(\\d+)`,
    )
    /**
     * PATCH /v1/api/common/{entity}/{id}
     * @summary Update one entity entry by its ID
     * @tags Entities routes
     * @security BearerAuth
     * @param {string} entity.path.required entities availables: constellation, event, myth, place, planet, star, user
     * @param {integer} id.path.required identifier
     * @return {Constellation|Event|Myth|Place|Planet|Star} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Entity no found - application/json
     */
    .patch(security.checkJWT, commonValidator('body'), asyncWrapper(commonController.update))
    /**
     * DELETE /v1/api/common/{entity}/{id}
     * @summary Delete one entity entry by its ID
     * @tags Entities routes
     * @security BearerAuth
     * @param {string} entity.path.required entities availables: constellation, event, myth, place, planet, star, user
     * @param {integer} id.path.required identifier
     * @return {Constellation|Event|Myth|Place|Planet|Star} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Entity no found - application/json
     */
    .delete(security.checkJWT, asyncWrapper(commonController.delete));

module.exports = router;
