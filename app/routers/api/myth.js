const express = require('express');

const router = express.Router();
const { mythController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');

router
    .route('/random')
    /**
     * GET /v1/api/myth/random
     * @summary Get one random myth with its constellation or star or galaxy
     * @tags Myth
     * @return {Myth} 200 - success response - application/json
     */
    .get(asyncWrapper(mythController.selectRandom));

router
    .route('/:id(\\d+)')
    /**
     * GET /v1/api/myth/{id}
     * @summary Get one myth with its with its constellation or star or galaxy
     * @tags Myth
     * @param {integer} id.path.required constellation identifier
     * @return {Myth} 200 - success response - application/json
     */
    .get(asyncWrapper(mythController.selectByPk));

module.exports = router;
