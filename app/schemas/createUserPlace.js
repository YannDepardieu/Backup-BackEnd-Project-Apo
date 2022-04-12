const Joi = require('joi');

module.exports = Joi.object({
    name: Joi.string().max(30).required(),
    address: Joi.string().max(70),
}).required();
