const express = require('express');

const router = express.Router();
const { constellationController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');

router
    .route('/:id')
    /**
     * GET /v1/main-api/api/constellations
     * @summary Get all the constellations myths
     * @tags Myth
     * @return {[constellation]} 200 - success response - application/json
     */
    .get(asyncWrapper(constellationController.getByPkWithMyths));

module.exports = router;
