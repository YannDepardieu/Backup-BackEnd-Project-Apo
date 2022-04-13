const Joi = require('joi');

module.exports = Joi.object({
    name: Joi.string().max(30),
    address: Joi.string().max(100),
    event_datetime: Joi.date().min('now'),
    recall_datetime: Joi.date().min('now').max(Joi.ref('event_datetime')),
})
    .min(1)
    .required();
