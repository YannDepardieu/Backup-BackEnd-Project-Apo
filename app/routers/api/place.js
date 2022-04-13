const express = require('express');

const router = express.Router();
const { placeController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');
const security = require('../../middlewares/security');
const validator = require('../../middlewares/validator');
const userPlaceSchema = require('../../schemas/createUserPlace');

router
    .route('/')
    /**
     * GET /v1/api/place
     * @summary Gets all user's favorites places
     * @tags Place
     * @return {array<Place>} 200 - success response - application/json
     */
    .get(security.checkJWT, asyncWrapper(placeController.getAllPlaces))
    /**
     * POST /v1/api/place
     * @summary Creates a new place and sets it as a user's favorite place
     * @tags Place
     * @return {string} 200 - success response - application/json
     */
    .post(
        security.checkJWT,
        validator('body', userPlaceSchema),
        asyncWrapper(placeController.createNewPlace),
    );

router
    .route('/:id(\\d+)')
    /**
     * GET /v1/api/place{id}
     * @summary Gets all user's favorites places
     * @tags Place
     * @param {integer} id.path.required identifier
     * @return {Place} 200 - success response - application/json
     */
    .get(security.checkJWT, asyncWrapper(placeController.getOnePlace))
    /**
     * PATCH /v1/api/place{id}
     * @summary Updates one user's favorite place
     * @tags Place
     * @param {integer} id.path.required identifier
     * @return {string} 200 - success response - application/json
     */
    .patch(security.checkJWT, asyncWrapper(placeController.updateOnePlace))
    /**
     * DELETE /v1/api/place{id}
     * @summary Deletes one user's favorite place
     * @tags Place
     * @param {integer} id.path.required identifier
     * @return {string} 200 - success response - application/json
     */
    .delete(security.checkJWT, asyncWrapper(placeController.deleteOnePlace));

module.exports = router;
