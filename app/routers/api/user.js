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
     * @return {string} Auth_Ok 200 - success response - application/json AND a token in the header
     */
    .post(asyncWrapper(userController.auth));

router
    // FIX THAT JSDOCS ! /user/profil
    // is it post or get... check summary
    // what does it return ? Type it
    .route('/profil')
    /**
     * GET /v1/api/user/profil
     * @summary Get
     * @tags User
     * @return {object} 200 - success response - application/json
     */
    .get(security.checkJWT, asyncWrapper(userController.getOne));

module.exports = router;
