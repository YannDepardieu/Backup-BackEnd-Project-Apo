const express = require('express');

const router = express.Router();
const { mythController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');

router
    .route('/random')
    /**
     * GET /v1/api/myth/random
     * @summary Get one random myth with its constellation
     * @tags Myth
     * @return {RandomMyth} 200 - success response - application/json
     */
    .get(asyncWrapper(mythController.getRandomWithConstellation));

router
    .route('/:id(\\d+)')
    /**
     * GET /v1/api/myth/{id}
     * @summary Get one myth with its celestial body
     * @tags Myth
     * @param {integer} id.path.required constellation identifier
     * @return {FullMyth} 200 - success response - application/json
     */
    .get(asyncWrapper(mythController.getOneMyth));

module.exports = router;
