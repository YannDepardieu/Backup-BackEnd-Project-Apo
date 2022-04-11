const debug = require('debug')('userController');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { createClient } = require('redis');
const ApiError = require('../../errors/apiError');

const User = require('../../models/user');

const PREFIX = 'logoutToken';

const { seekToken, blackList } = require('../../services/seekAuth');

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
        const data = await User.insert(req.body);
        // debug(data);
        return res.json(data);
    },
    async auth(req, res) {
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

                    // Puis on ajoute le token dans l’entête de la réponse avant de renvoyer le auth_ok
                    res.header('Authorization', `Bearer ${token}`);

                    return res.status(200).json('auth_ok');
                }
                // Si les mots de passe ne correspondent pas
                return res.status(403).json('wrong_credentials');
            });
        }
        // Si on ne trouve pas l'user
        return res.status(404).json('user_not_found');
    },

    async getOne(req, res) {
        const data = await User.findByPk(req.decoded.cleanedUser.id);
        if (!data) {
            throw new ApiError('User not found', { statusCode: 404 });
        }
        delete data.password;
        return res.json(data);
    },

    async update(req, res) {
        const { id } = req.decoded.cleanedUser;
        const user = await User.findByPk(id);
        if (!user) {
            throw new ApiError(`This user does not exists`, { statusCode: 404 });
        }
        debug('user = ', user);
        debug('req.body = ', req.body);
        let result;
        bcrypt.compare(req.body.oldPassword, user.password, async (err, response) => {
            debug('ICI');
            if (err) {
                throw new Error(err);
            }
            if (response) {
                debug('password ', response);
                const notUnique = await User.isUnique(req.body, id);
                debug('notUnique = ', notUnique);
                if (notUnique) {
                    throw new ApiError(`This user is not unique`, { statusCode: 400 });
                }
                delete req.body.oldPassword;
                if (req.body.newPassword) {
                    req.body.password = bcrypt.hashSync(req.body.newPassword, 10);
                    delete req.body.newPassword;
                }
                const output = await User.update(id, req.body);
                debug('output = ', output);
                delete output.password;
                result = res.json(output);
                return;
            }
            debug('password ', response);
        });
        if (result) {
            return result;
        }
        throw new ApiError(`Old password is not correct`, { statusCode: 400 });
    },

    async logout(req, res) {
        // Delete the stored token from client side upon log out
        res.removeHeader('Authorization');

        // Have DB of no longer active tokens that still have some time to live
        const key = `${PREFIX}${req.decoded.iat}`;
        const token = seekToken(req);
        blackList(key, token);

        res.status(200).json('user disconnected');
    },
};

module.exports = userController;
