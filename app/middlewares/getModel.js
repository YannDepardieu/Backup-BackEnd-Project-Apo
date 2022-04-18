// const debug = require('debug')('middleware:getModel');
const Models = require('../models');
const ApiError = require('../errors/apiError');

// méthode pour récupérer un Model en fonction de l'entité demandée
module.exports = (req, res, next) => {
    // on parcourt tous les Models que l'on a require
    Models.forEach((Model) => {
        // si le nom est celui recherché (on lit la propriété statique du modèle pour savoir)
        // routeName est une prop static
        if (Model.routeName === req.params.entity || Model.tableName === req.params.entity) {
            res.locals.Model = Model;
        }
    });

    if (!res.locals.Model) {
        throw new ApiError('Wrong entity', { statusCode: 404 });
    }
    next();
};
