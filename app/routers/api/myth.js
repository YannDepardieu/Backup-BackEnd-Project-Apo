const express = require('express');

const router = express.Router();
const { mythController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');

router
    .route('/random')
    /**
     * GET /v1/api/myth/random
     * @tags Myth
     * @summary Get one random myth with its constellation or star or galaxy
     * @return {Myth} 200 - success response - application/json
     */
    .get(asyncWrapper(mythController.selectRandom));

router
    .route('/:id(\\d+)')
    /**
     * GET /v1/api/myth/{id}
     * @tags Myth
     * @summary Get one myth with its with its constellation or star or galaxy
     * @param {integer} id.path.required constellation identifier
     * @return {Myth} 200 - success response - application/json
     * @return {ApiError} 404 - Myth not found for this id - application/json
     */
    .get(asyncWrapper(mythController.selectByPk));

module.exports = router;
