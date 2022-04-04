const Joi = require('joi');

module.exports = Joi.object({
    firstname: Joi.string().alphanum(),
    lastname: Joi.string().alphanum(),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(32),
    role: Joi.string().pattern(/(^admin$)|(^user$)/m),
    notification: Joi.bool(),
    geolocalisation: Joi.bool(),
})
    .min(1)
    .required();
