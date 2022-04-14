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
     * @security BearerAuth
     * @return {array<Place>} 200 - success response - application/json
     */
    .get(security.checkJWT, asyncWrapper(placeController.selectAll))
    /**
     * POST /v1/api/place
     * @summary Creates a new place and sets it as a user's favorite place
     * @tags Place
     * @security BearerAuth
     * @return {FavoritePlace} 200 - success response - application/json
     */
    .post(
        security.checkJWT,
        validator('body', userPlaceSchema),
        asyncWrapper(placeController.insert),
    );

router
    .route('/:id(\\d+)')
    /**
     * GET /v1/api/place{id}
     * @summary Gets all user's favorites places
     * @tags Place
     * @security BearerAuth
     * @param {integer} id.path.required identifier
     * @return {Place} 200 - success response - application/json
     */
    .get(security.checkJWT, asyncWrapper(placeController.selectByPk))
    /**
     * PATCH /v1/api/place{id}
     * @summary Updates one user's favorite place
     * @tags Place
     * @param {integer} id.path.required identifier
     * @return {Place} 200 - success response - application/json
     */
    .patch(security.checkJWT, asyncWrapper(placeController.update))
    /**
     * DELETE /v1/api/place{id}
     * @summary Deletes one user's favorite place
     * @tags Place
     * @security BearerAuth
     * @param {integer} id.path.required identifier
     * @return {string} 200 - success response - application/json
     */
    .delete(security.checkJWT, asyncWrapper(placeController.delete));

module.exports = router;
