const express = require('express');

const router = express.Router();
const { geocodingController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');

router
    .route('/forward')
    /**
     * GET /v1/api/geocoding/forward
     * @summary Give an address to get latitude and longitude
     * @tags latitude longitude
     * @return {[latitude, longitude]} 200 - success response - application/json
     */
    .get(asyncWrapper(geocodingController.forward));

router
    .route('/reverse')
    /**
     * GET /v1/api/geocoding/reverse
     * @summary Give a latitude and longitude to get an address
     * @tags address
     * @return {[address]} 200 - success response - application/json
     */
    .get(asyncWrapper(geocodingController.reverse));

module.exports = router;
