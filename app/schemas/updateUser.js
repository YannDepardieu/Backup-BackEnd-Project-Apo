const Joi = require('joi');

module.exports = Joi.object({
    firstname: Joi.string().max(20).alphanum(),
    lastname: Joi.string().max(20).alphanum(),
    email: Joi.string().max(40).email(),
    newPassword: Joi.string().min(2).max(32),
    oldPassword: Joi.string().min(2).max(32),
    role: Joi.string().pattern(/^user$/m),
    notification: Joi.bool(),
})
    .min(1)
    .required();
