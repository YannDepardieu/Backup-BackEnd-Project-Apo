const express = require('express');

const router = express.Router();
const { commonController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');

router
    .route('/:entity')
    /**
     * GET /v1/api/common/{entity}
     * @summary Get all entrires for an entity
     * @tags Entities routes
     * @param {string} entity.path.required entities availables: constellation, myth, planet, star, user
     * @return {array<Constellation>|array<Myth>|array<Planet>|array<Star>|array<User>} 200 - success response - application/json
     */
    .get(asyncWrapper(commonController.getAll));

router
    .route('/:entity/:id')

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
    .get(asyncWrapper(commonController.getByPk));

module.exports = router;
