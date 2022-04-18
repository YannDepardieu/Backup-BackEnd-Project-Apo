const express = require('express');

const router = express.Router();
const { userController } = require('../../controllers/api');
const asyncWrapper = require('../../middlewares/asyncWrapper');
const security = require('../../middlewares/security');
const validator = require('../../middlewares/validator');
const updateUserSchema = require('../../schemas/updateUser');
const createUserSchema = require('../../schemas/createUser');

router
    .route('/')
    /**
     * POST /v1/api/user/
     * @tags User
     * @summary Insert a user
     * @param {User} request.body.required Express req.object
     * @return {User} 200 - success response - application/json
     * @return {ApiError} 400 - Bad Request : Input data is not in the valid format - application/json
     * @return {ApiError} 400 - Bad Request : This User new entry is not unique - application/json
     */
    .post(validator('body', createUserSchema), asyncWrapper(userController.insert))
    /**
     * GET /v1/api/user/
     * @tags User
     * @summary Select user's profil details by its id (in the token)
     * @security BearerAuth
     * @return {User} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     * @return {ApiError} 404 - User not found for this id - application/json
     */
    .get(security.checkJWT, asyncWrapper(userController.selectByPk))
    /**
     * PATCH /v1/api/user/
     * @tags User
     * @summary Update user by its id (in the token)
     * @security BearerAuth
     * @param {User} request.body identifier
     * @return {User} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     * @return {ApiError} 400 - Bad Request : Input data is not in the valid format - application/json
     * @return {ApiError} 404 - User not found for this id - application/json
     * @return {ApiError} 403 - Bad Request : Old password is not correct - application/json
     * @return {ApiError} 400 - Bad Request : This User new entry is not unique - application/json
     */
    .patch(
        security.checkJWT,
        validator('body', updateUserSchema),
        asyncWrapper(userController.update),
    )
    /**
     * DELETE /v1/api/user/
     * @tags User
     * @summary Delete user by its id (in the token)
     * @security BearerAuth
     * @return {boolean} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     * @return {ApiError} 404 - User not found for this id - application/json
     * @return {ApiError} 403 - Bad Request : Password is not correct - application/json
     */
    .delete(security.checkJWT, asyncWrapper(userController.delete));

router
    .route('/login')
    /**
     * POST /v1/api/user/login
     * @tags User
     * @summary User send his email and password to login and get back a token
     * @param {Authentification} request.body Express req.object
     * @return {boolean} 200 - success response - application/json AND a token in the header
     * @return {ApiError} 404 - User not found for this data (email) - application/json
     * @return {ApiError} 403 - Forbidden : Wrong Email or password - application/json
     */
    .post(asyncWrapper(userController.login));

router
    .route('/logout')
    /**
     * GET /v1/api/user/logout
     * @tags User
     * @summary Logout user's session
     * @security BearerAuth
     * @return {boolean} 200 - success response - application/json
     * @return {ApiError} 401 - Unauthorized : Authentification needed - application/json
     */
    .get(security.checkJWT, asyncWrapper(userController.logout));

module.exports = router;
