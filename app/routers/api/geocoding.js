const express = require('express');

const router = express.Router();
const { geocodingController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');

router
    .route('/forward')
    /**
     * GET /v1/api/geocoding/forward
     * @summary Give an address to get latitude and longitude
     * @tags geocoding
     * @param address.query.required address to get a position
     * @return {Position} 200 - success response - application/json
     * @exemple request - Latitude and longitude payload
     * { Avenida Mariscal Santa Cruz 1066, La Paz }
     */
    .get(asyncWrapper(geocodingController.forward));

router
    .route('/reverse')
    /**
     * GET /v1/api/geocoding/reverse
     * @summary Give a latitude and longitude to get an address
     * @tags geocoding
     * @param gps.query.required gps to get an address
     * @return {Address} 200 - success response - application/json
     * @exemple request - Latitude and longitude payload
     * { 0.7638435,-73.9729691 }
     */
    .get(asyncWrapper(geocodingController.reverse));

module.exports = router;
