const Joi = require('joi');

module.exports = Joi.object({
    constellation_id: Joi.number().integer().required(),
}).required();
