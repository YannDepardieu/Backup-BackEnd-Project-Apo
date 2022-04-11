const Joi = require('joi');

module.exports = Joi.object({
    name: Joi.string().max(20),
    address: Joi.string().max(30),
    postalcode: Joi.string().max(10),
    city: Joi.string().max(20),
    latitude: Joi.number().precision(4).min(-90).max(90),
    longitude: Joi.number().precision(4).min(-180).max(180),
})
    .and('address', 'latitude')
    .and('address', 'longitude')
    .min(1)
    .required();
