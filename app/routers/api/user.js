const express = require('express');

const router = express.Router();
const { userController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');

router
    .route('/auth')
    /**
     * POST /v1/api/user/auth
     * @summary Post email and password to validate user et return a token
     * @tags Authorization
     * @return {message} 200 - success response - application/json and a token in the header
     */
    .get(asyncWrapper(userController.auth));

module.exports = router;
