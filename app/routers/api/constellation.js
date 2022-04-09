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

router
    .route('/names')
    /**
     * GET /v1/api/constellation/names
     * @summary Get a list with all the constellations names
     * @tags Constellation
     * @return {object} 200 - success response - application/json
     */
    .get(asyncWrapper(constellationController.getAllNames));

module.exports = router;
