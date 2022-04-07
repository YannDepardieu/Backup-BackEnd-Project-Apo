const express = require('express');

const router = express.Router();
const { commonController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');
const getModel = require('../../middlewares/getModel');
const commonValidator = require('../../middlewares/commonValidator');

router.use('/:entity', getModel);

router
    .route('/:entity')
    /**
     * GET /v1/main-api/api/constellations
     * @summary Get all the constellations myths
     * @tags Myth
     * @return {[constellation]} 200 - success response - application/json
     */
    .get(asyncWrapper(commonController.getAll));

router
    .route('/:entity/:id(\\d+)')
    /**
     * GET /v1/main-api/api/constellations/{id}
     * @summary Get one constellations myth by its ID
     * @tags Myth
     * @param {number} id.path.required constellation identifier
     * @return {constellation} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Constellation no found - application/json
     */
    .get(asyncWrapper(commonController.getByPk));

router
    .route('/:entity')
    /**
     * POST /v1/main-api/api/constellations/{id}
     * @summary Get one constellations myth by its ID
     * @tags Myth
     * @param {number} id.path.required constellation identifier
     * @return {constellation} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Constellation no found - application/json
     */
    .post(commonValidator('body'), asyncWrapper(commonController.createOne));

module.exports = router;
