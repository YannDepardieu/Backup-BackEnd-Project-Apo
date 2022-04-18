const Joi = require('joi');

module.exports = Joi.object({
    name: Joi.string().max(30).required(),
    address: Joi.string().max(100).required(),
    event_datetime: Joi.date().min('now').required(),
    recall_datetime: Joi.date().min('now').max(Joi.ref('event_datetime')).required(),
}).required();
