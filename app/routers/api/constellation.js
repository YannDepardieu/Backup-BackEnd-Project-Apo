const express = require('express');

const router = express.Router();
const { constellationController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');

router
    .route('/:id')
    /**
     * GET /v1/api/common/constellation/{id}
     * @summary Get one constellation by its ID with its myth
     * @tags Myth
     * @param {integer} id.path.required constellation identifier
     * @return {ConstellationMyth} 200 - success response - application/json
     */
    .get(asyncWrapper(constellationController.getByPkWithMyths));

module.exports = router;
