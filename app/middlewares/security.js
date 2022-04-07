// le middleware va être exécuté avant l’accès à une fonction d’un service,
// on va donc vérifier la validité du token et laisser passer ou pas la requête.

const jwt = require('jsonwebtoken');
// const debug = require('debug')('security:JWToken');
const User = require('../models/user');

const { JWTOKEN_KEY } = process.env;

// On crée la fonction checkJWT
// eslint-disable-next-line consistent-return
exports.checkJWT = async (req, res, next) => {
    // on commence par chercher si un token est présent dans le header de la requête
    let token = req.headers['x-access-token'] || req.headers.authorization;
    if (!!token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    // Si le token est présent on le vérifie
    if (token) {
        jwt.verify(token, JWTOKEN_KEY, async (err, decoded) => {
            // Si le token est expiré ou que quelqu’un a tenté de l’altérer
            if (err) {
                return res.status(401).json('token_not_valid');
            }
            // Dans le cas où la vérification est bonne on peut récupérer le contenu du payload
            // on décide ici de le passer à la requête pour pouvoir utiliser les informations dans la ou les fonctions
            // qui seront exécutées après celle ci.
            req.decoded = decoded; // passage du payload à la requête

            // eslint-disable-next-line no-underscore-dangle
            const user = await User.findByPk(req.decoded.user._id);
            // Je vérifie que l'id qui est dans le token de l'utilisateur qui a fait la requête en front correspond
            // bien à l'id de l'utilisateur stocké en base de donnée auquel l'utilisateur en front souhaite accèder
            if (user.id !== req.params.id) {
                return res.status(401).json('Your token does not allow you to get these infos');
            }

            const expiresIn = 24 * 60 * 60;
            // près ça on crée un nouveau token en l’ajoutant au header de la réponse
            const newToken = jwt.sign({ user: decoded.user }, JWTOKEN_KEY, { expiresIn });
            res.header('Authorization', `Bearer ${newToken}`);
            // On finit avec la fonction next() qui permet comme son nom l’indique de passer à la fonction suivante.
            return next();
        });
    } else {
        // Si le token n'est pas présent dans le header de la requête
        return res.status(401).json('token_required');
    }
};
