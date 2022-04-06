const express = require('express');

const router = express.Router();
const { mythController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');

router
    .route('/random')
    /**
     * GET /v1/main-api/api/constellations
     * @summary Get all the constellations myths
     * @tags Myth
     * @return {myth} 200 - success response - application/json
     */
    .get(asyncWrapper(mythController.getRandomWithConstellation));

module.exports = router;
