const Joi = require('joi');

module.exports = Joi.object({
    user_id: Joi.number().integer().required(),
    constellation_id: Joi.number().integer().required(),
}).required();
