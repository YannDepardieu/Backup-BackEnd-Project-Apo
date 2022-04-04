const Joi = require('joi');

module.exports = Joi.object({
    firstname: Joi.string().alphanum().required(),
    lastname: Joi.string().alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(32).required(),
    role: Joi.string()
        .pattern(/(^admin$)|(^user$)/m)
        .required(),
    notification: Joi.bool(),
    geolocalisation: Joi.bool(),
}).required();

// module.exports = Joi.object({
//     label: Joi.string().required(),
//     route: Joi.string()
//         .pattern(/^\/[a-zA-Z\\/]*[^\\/]$/)
//         .required(),
// }).required();

// module.exports = Joi.object({
//     label: Joi.string(),
//     route: Joi.string()
//         .pattern(/^\/[a-zA-Z\\/]*[^\\/]$/),
// }).min(1).required();

// module.exports = Joi.object({
//     slug: Joi.string()
//         .pattern(/^[^-][a-zA-Z0-9-]+[^-]$/)
//         .required(),
//     title: Joi.string().required(),
//     category_id: Joi.number().integer().min(1).required(),
//     excerpt: Joi.string(),
//     content: Joi.string(),
// }).required();

// module.exports = Joi.object({
//     slug: Joi.string()
//         .pattern(/^[^-][a-zA-Z0-9-]+[^-]$/),
//     title: Joi.string(),
//     category_id: Joi.number().integer().min(1),
//     excerpt: Joi.string(),
//     content: Joi.string(),
// }).min(1).required();

// const incident = Joi.object({
//     incident_number: Joi.string().min(1).required(),
//     event_id: Joi.number().integer().positive().required(),
//     nature: Joi.string().min(1).required(),
//     technician: Joi.string().min(1).required(),
//     comment: Joi.string().allow('').optional()
// });

// const schema = Joi.object({
//     name: Joi.string(),
//     adjective: Joi.string(),
//     verb: Joi.string(),
//     complement: Joi.string(),
// il serait difficile de plus qualifier les propriétés
// attendues à cause de la richesse de la langue française
// en revanche, rien ne nous empèche de mettre en place
// des gardes-fous au niveau de l'object lui-même afin que
// joi cheke s'il contient au moins une propriété et au maximum 4 propriétés
// }).required().min(1).max(4);

// module.exports = Joi.object({ // on demande un objet qui :
//     target: Joi.string().uri( { scheme:["http","https"] }).required(),
//     // a une target requise qui est un string respectant le format "uri" avec http et https
//     password: Joi.string().min(8).required()
//     // a un password requis qui est un string de minimum 8 caractères
// });
