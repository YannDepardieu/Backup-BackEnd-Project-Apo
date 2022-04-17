// eslint-disable-next-line no-unused-vars
const debug = require('debug')('Validator:log');
const ApiError = require('../errors/apiError');

/**
 * Generic middleware generator that validate an object fron a request propriety
 * @param {string} prop - Propriety request object name that needs validation
 * @param {Joi.object} schema - Joi module validation schema
 * @return {Function} -
 * Send back a middleware that validates the body of the request using the parameter schema
 * Send back an error 400 if the validation fail
 */
module.exports = (prop, schema) => async (request, _, next) => {
    try {
        await schema.validateAsync(request[prop]);
        next();
    } catch (error) {
        // When the schema is not respected, an error is sended to the user
        // STATUS HTTP for a user input error : 400
        // We shape the error following our normalization
        next(new ApiError(error.details[0].message, { statusCode: 400 }));
    }
};
