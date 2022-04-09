const express = require('express');

const router = express.Router();
const { userController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');
const security = require('../../middlewares/security');

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
    .route('/profil')
    /**
     * GET /v1/api/user/profil
     * @summary Get one user's profil details
     * @tags User
     * @security BearerAuth
     * @return {AuthenticatedUser} 200 - success response - application/json
     * @return {ApiError} 404 - Not found response - application/json
     */
    .get(security.checkJWT, asyncWrapper(userController.getOne));

module.exports = router;
