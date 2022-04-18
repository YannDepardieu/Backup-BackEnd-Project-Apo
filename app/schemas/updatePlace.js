const Joi = require('joi');

module.exports = Joi.object({
    name: Joi.string().max(30),
    address: Joi.string().max(70),
})
    .min(1)
    .required();
