const Joi = require('joi');

module.exports = Joi.object({
    name: Joi.string().max(20).alphanum().required(),
    address: Joi.string().max(30).alphanum(),
    postalcode: Joi.string().max(10),
    city: Joi.string().max(20).alphanum(),
    latitude: Joi.number().precision(4).min(-90).max(90).required(),
    longitude: Joi.number().precision(4).min(-180).max(180).required(),
}).required();
