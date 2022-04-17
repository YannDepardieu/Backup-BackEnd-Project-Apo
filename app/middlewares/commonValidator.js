// const debug = require('debug')('Validator:log');
const ApiError = require('../errors/apiError');
const schemas = require('../schemas');
/**
 * Generic middleware generator that validate an object fron a request propriety
 * @param {string} prop - Propriety request object name that needs validation
 * @return {Function} -
 * Send back a middleware that validates the body of the request using the parameter schema
 * Send back an error 400 if the validation fail
 */
module.exports = (prop) => async (req, res, next) => {
    try {
        let schema;
        if (req.method === 'POST') {
            Object.keys(schemas).forEach((key) => {
                const regex = new RegExp(`^create${res.locals.Model.tableName}`, 'mi');
                if (regex.test(key)) {
                    schema = schemas[key];
                }
            });
        } else {
            Object.keys(schemas).forEach((key) => {
                const regex = new RegExp(`^update${res.locals.Model.tableName}`, 'mi');
                if (regex.test(key)) {
                    schema = schemas[key];
                }
            });
        }
        await schema.validateAsync(req[prop]);

        next();
    } catch (error) {
        // When the schema is not respected, an error is sended to the user
        // STATUS HTTP for a user input error : 400
        // We shape the error following our normalization
        next(new ApiError(error.details[0].message, { statusCode: 400 }));
    }
};
