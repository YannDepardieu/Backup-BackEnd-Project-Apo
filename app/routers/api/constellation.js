const express = require('express');

const router = express.Router();
const { constellationController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');

router
    .route('/:id(\\d+)')
    /**
     * GET /v1/api/constellation/{id}
     * @summary Get one constellation by its ID with its myth
     * @tags Constellation
     * @param {integer} id.path.required constellation identifier
     * @return {ConstellationMyth} 200 - success response - application/json
     */
    .get(asyncWrapper(constellationController.getByPkWithMyths));
// route getAllNames pour le json des noms des constellations

module.exports = router;
