const express = require('express');

const router = express.Router();
const { userController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');
const security = require('../../middlewares/security');
const validator = require('../../middlewares/validator');
const updateSchema = require('../../schemas/updateUser');

router
    .route('/auth')
    /**
     * POST /v1/api/user/auth
     * @summary Post email and password to validate user et return a token
     * @tags User
     * @param {AuthenticationRequest} request.body Express req.object
     * @return {string} 200 - success response - application/json AND a token in the header
     */
    .post(asyncWrapper(userController.auth));

router
    .route('/')
    /**
     * GET /v1/api/user/
     * @summary Get one user's profil details
     * @tags User
     * @security BearerAuth
     * @return {AuthenticatedUser} 200 - success response - application/json
     * @return {ApiError} 404 - Not found response - application/json
     */
    .get(security.checkJWT, asyncWrapper(userController.getOne))
    /**
     * PATCH /v1/api/user/
     * @summary Update one entity entry by its ID
     * @tags Entities routes
     * @param {string} entity.path.required entities availables: constellation, event, myth, place, planet, star, user
     * @param {integer} id.path.required identifier
     * @return {Constellation|Event|Myth|Place|Planet|Star|User} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Entities no found - application/json
     */
    .patch(security.checkJWT, validator('body', updateSchema), asyncWrapper(userController.update));

module.exports = router;
