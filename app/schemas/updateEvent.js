const Joi = require('joi');

module.exports = Joi.object({
    name: Joi.string().alphanum(),
    event_datetime: Joi.date().min('now').timestamp(),
    latitude: Joi.number().precision(5).min(-200).max(200),
    longitude: Joi.number().precision(5).min(-200).max(200),
    recall_datetime: Joi.date().min('now').max(Joi.ref('event_datetime')).timestamp(),
})
    .min(1)
    .required();
