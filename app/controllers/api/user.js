// eslint-disable-next-line no-unused-vars
const debug = require('debug')('userController');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { createClient } = require('redis');
const ApiError = require('../../errors/apiError');

const User = require('../../models/user');

const PREFIX = 'logoutToken';

const { seekToken, disableToken } = require('../../services/seekAuth');

const { JWTOKEN_KEY } = process.env;
const userController = {
    /**
     * Authentication Request
     * @typedef {object} AuthenticationRequest
     * @property {string} email - Authentication email
     * @property {string} password - Authentication password
     */
    /**
     * Authenticated User
     * @typedef {object} AuthenticatedUser
     * @property {integer} id - User's id
     * @property {string} firstname - User's firstname
     * @property {string} lastname - User's lastname
     * @property {string} email - User's email
     * @property {string} role - User's role
     * @property {boolean} notification - User's authorisation to get email notifications
     */
    /**
     * Api controller to get one user myth by its ID.
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @return {string} Route API JSON data
     */
    async createOne(req, res) {
        // debug(req.body);
        const found = await User.isUnique(req.body);
        // debug('found ', found);
        if (found) {
            throw new ApiError(`${User.tableName} is not unique`, { statusCode: 404 });
        }
        const user = await User.insert(req.body);
        delete user.password;
        return res.json(user);
    },
    async login(req, res, next) {
        const { email, password } = req.body;
        // On recherche notre utilisateur grâce à son email
        const user = await User.findOne({ email });
        // S’il existe on compare le mot de passe fourni avec celui qui est enregistré en base de données
        if (user) {
            // vérifier que le mot de passe est bien le même que celui enregistré en base de donnée.
            return bcrypt.compare(password, user.password, (err, response) => {
                if (err) {
                    throw new Error(err);
                }
                if (response) {
                    // Sert à supprimer le password de l’objet user qu’on va passer dans le payload du token.
                    // eslint-disable-next-line no-underscore-dangle
                    delete user.password;
                    const cleanedUser = {
                        id: user.id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        role: user.role,
                        notification: user.notification,
                    };

                    const expiresIn = 24 * 60 * 60;
                    // On signe ensuite le token avec toutes nos infos et la clé secrète,
                    const token = jwt.sign({ cleanedUser }, JWTOKEN_KEY, { expiresIn });

                    // Puis on ajoute le token dans l’entête de la réponse avant de renvoyer le login: true
                    res.header('Authorization', `Bearer ${token}`);

                    return res.status(200).json({ login: true });
                }
                // Si les mots de passe ne correspondent pas
                return next(new ApiError('wrong email or password', { statusCode: 403 }));
            });
        }
        // Si on ne trouve pas l'user
        return next(new ApiError('wrong email or password', { statusCode: 403 }));
    },

    async getOne(req, res) {
        const data = await User.findByPk(req.decoded.cleanedUser.id);
        delete data.password;
        return res.json(data);
    },

    async update(req, res, next) {
        const { id } = req.decoded.cleanedUser;
        const user = await User.findByPk(id);
        bcrypt.compare(req.body.oldPassword, user.password, async (err, response) => {
            if (err) {
                throw new Error(err);
            }
            if (response) {
                const notUnique = await User.isUnique(req.body, id);
                if (notUnique) {
                    return next(new ApiError('This user is not unique', { statusCode: 400 }));
                }
                delete req.body.oldPassword;
                if (req.body.newPassword) {
                    req.body.password = bcrypt.hashSync(req.body.newPassword, 10);
                    delete req.body.newPassword;
                }
                const output = await User.update(id, req.body);
                delete output.password;
                return res.json(output);
            }
            return next(new ApiError('Old password is not correct', { statusCode: 400 }));
        });
    },

    async logout(req, res) {
        // Delete the stored token from client side upon log out
        res.removeHeader('Authorization');
        // Have DB of no longer active tokens that still have some time to live
        const key = `${PREFIX}${req.decoded.iat}`;
        const token = seekToken(req);
        disableToken(key, token);

        res.status(200).json({ logout: true });
    },

    async delete(req, res, next) {
        const { id } = req.decoded.cleanedUser;
        const user = await User.findByPk(id);
        bcrypt.compare(req.body.password, user.password, async (err, response) => {
            if (err) {
                throw new Error(err);
            }
            if (response) {
                const output = await User.deleteByPk(id);
                return res.json(output);
            }
            return next(new ApiError('password is not correct', { statusCode: 400 }));
        });
    },
};

module.exports = userController;
