const express = require('express');

const router = express.Router();
const { geocodingController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');

router
    .route('/forward')
    /**
     * GET /v1/api/geocoding/forward/
     * @summary You send an address to get latitude and longitude
     * @tags Geocoding
     * @param {string} address.query.required address to get a position
     * @example query - Address payload
     * { Avenida Mariscal Santa Cruz 1066, La Paz }
     * @return {array<Position>} 200 - success response - application/json
     * @return {ApiError} 404 - No latitude and longitude for this address - application/json
     */
    .get(asyncWrapper(geocodingController.forward));

router
    .route('/reverse')
    /**
     * GET /v1/api/geocoding/reverse/
     * @summary You send a latitude and longitude to get an address
     * @tags Geocoding
     * @param {string} gps.query.required gps to get an address
     * @example request - Latitude and longitude payload
     * { 0.7638435,-73.9729691 }
     * @return {Address} 200 - success response - application/json
     * @return {ApiError} 400 - Bad Request : Wrong latitude and longitude range - application/json
     * @return {ApiError} 404 - No address for this latitude and longitude - application/json
     */
    .get(asyncWrapper(geocodingController.reverse));

module.exports = router;
