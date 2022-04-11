const Joi = require('joi');

module.exports = Joi.object({
    place_id: Joi.number().integer().required(),
    user_id: Joi.number().integer().required(),
}).required();
