const express = require('express');

const router = express.Router();
const { commonController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');
const getModel = require('../../middlewares/getModel');
const commonValidator = require('../../middlewares/commonValidator');
const security = require('../../middlewares/security');

router.use('/:entity', getModel);

router
    .route('/:entity')
    /**
     * GET /v1/api/common/{entity}
     * @summary Get all entries for an entity
     * @tags Entities routes
     * @param {string} entity.path.required entities availables: constellation, myth, planet, star, user
     * @return {array<Constellation>|array<Myth>|array<Planet>|array<Star>|array<User>} 200 - success response - application/json
     */
    .get(asyncWrapper(commonController.getAll))
    /**
     * POST /v1/api/common/{entity}
     * @summary Create one entity entry
     * @tags Entities routes
     * @param {string} entity.path.required Entities availables: constellation, myth, planet, star, user
     * @param {InscriptionUser} request.body Informations if you are creating a new USER
     * @return {Constellation|Event|Myth|Place|Planet|Star|User} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     */
    .post(commonValidator('body'), asyncWrapper(commonController.createOne));

router
    .route('/:entity/:id(\\d+)')
    /**
     * GET /v1/api/common/{entity}/{id}
     * @summary Get one entity entry by its ID
     * @tags Entities routes
     * @param {string} entity.path.required entities availables: constellation, event, myth, place, planet, star, user
     * @param {integer} id.path.required constellation identifier
     * @return {Constellation|Event|Myth|Place|Planet|Star|User} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Constellation no found - application/json
     */
    .get(asyncWrapper(commonController.getByPk))
    /**
     * DELETE /v1/api/common/{entity}/{id}
     * @summary Delete one entity entry by its ID
     * @tags Entities routes
     * @security BearerAuth
     * @param {string} entity.path.required entities availables: constellation, event, myth, place, planet, star, user
     * @param {integer} id.path.required constellation identifier
     * @return {string} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Constellation no found - application/json
     */
    .delete(security.checkJWT, asyncWrapper(commonController.deleteOne));

module.exports = router;
