const express = require('express');

const router = express.Router();
const { commonController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');

router
    .route('/:entity')
    /**
     * GET /v1/api/common/{entity}
     * @summary CRUD over all entities
     * @tags Entities routes
     * @param {string} entity.path.required entities availables: constellation, event, myth, place, planet, star, user
     * @return {Constellation|Event} 200 - success response - application/json
     */
    .get(asyncWrapper(commonController.getAll));

router
    .route('/:entity/:id')
    /**
     * GET /v1/api/common/constellation/{id}
     * @summary Get one constellations myth by its ID
     * @tags Constellation with myth by Constellation ID
     * @param {integer} id.path.required constellation identifier
     * @return {constellation&myth} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Constellation no found - application/json
     */
    .get(asyncWrapper(commonController.getByPk));

module.exports = router;
