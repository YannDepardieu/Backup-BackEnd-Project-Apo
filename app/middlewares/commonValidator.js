const debug = require('debug')('Validator:log');
const ApiError = require('../errors/apiError');

/**
 * Generic middleware generator that validate an object fron a request propriety
 * @param {string} prop - Propriety request object name that needs validation
 * @param {Joi.object} schema - Joi module validation schema
 * @returns {Function} -
 * Send back a middleware that validates the body of the request using the parameter schema
 * Send back an error 400 if the validation fail
 */
module.exports = (prop) => async (req, res, next) => {
    try {
        if (res.locals.Models) {
            if (res.locals.Models)
            // la "value" on s'en fiche on la récupère pas
            // request['body'] == request.body
            debug(req[prop]);
            await schema.validateAsync(req[prop]);
        }

        next();
    } catch (error) {
        // Je dois afficher l'erreur à l'utilisateur
        // STATUS HTTP pour une erreur de saise : 400
        // On réabille l'erreur en suivant notre propre normalisation
        next(new ApiError(error.details[0].message, { statusCode: 400 }));
    }
};
