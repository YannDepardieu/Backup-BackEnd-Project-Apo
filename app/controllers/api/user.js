// eslint-disable-next-line no-unused-vars
const debug = require('debug')('userController');

const bcrypt = require('bcryptjs');

const ApiError = require('../../errors/apiError');

const User = require('../../models/user');

const { createToken, disableToken } = require('../../services/tokensManager');

const userController = {
    /**
     * User
     * @typedef {object} User
     * @property {integer} id - User's id
     * @property {string} firstname - User's firstname
     * @property {string} lastname - User's lastname
     * @property {string} email - User's email
     * @property {boolean} notification - User's authorisation to get email notifications
     */
    /**
     * Authentification
     * @typedef {object} Authentification
     * @property {string} email - Authentication email
     * @property {string} password - Authentication password
     */
    /**
     * Api controller to get one user myth by its ID.
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @return {string} Route API JSON data
     */
    async insert(req, res) {
        await User.isUnique(req.body);
        // Another security to be sure a user cannot set role to admin
        if (req.body.role) req.body.role = 'user';
        const output = await User.insert(req.body);
        delete output.password;
        return res.status(200).json(output);
    },

    async selectByPk(req, res) {
        debug('req.decoded = ', req.decoded.user);
        const output = await User.selectByPk(req.decoded.user.id);
        delete output.password;
        return res.status(200).json(output);
    },

    async update(req, res, next) {
        const { id } = req.decoded.user;
        const user = await User.selectByPk(id);
        bcrypt.compare(req.body.oldPassword, user.password, async (err, response) => {
            if (err) {
                throw new Error(err);
            }
            if (response) {
                await User.isUnique(req.body, id);
                // Another security to be sure a user cannot set role to admin
                if (req.body.role) req.body.role = 'user';
                delete req.body.oldPassword;
                if (req.body.newPassword) {
                    req.body.password = bcrypt.hashSync(req.body.newPassword, 10);
                    delete req.body.newPassword;
                }
                const output = await User.update(id, req.body);
                delete output.password;
                return res.status(200).json(output);
            }
            return next(new ApiError('Old password is not correct', { statusCode: 403 }));
        });
    },

    async delete(req, res, next) {
        const { id } = req.decoded.user;
        const user = await User.selectByPk(id);
        bcrypt.compare(req.body.password, user.password, async (err, response) => {
            if (err) {
                throw new Error(err);
            }
            if (response) {
                const output = await User.delete(id);
                return res.status(200).json(output);
            }
            return next(new ApiError('Password is not correct', { statusCode: 403 }));
        });
    },

    async login(req, res, next) {
        const { email, password } = req.body;
        // On recherche notre utilisateur grâce à son email
        const rawUser = await User.selectOne({ email });
        // S’il existe on compare le mot de passe fourni avec celui qui est enregistré en base de données
        if (rawUser) {
            // vérifier que le mot de passe est bien le même que celui enregistré en base de donnée.
            return bcrypt.compare(password, rawUser.password, (err, response) => {
                if (err) {
                    throw new Error(err);
                }
                if (response) {
                    // Sert à supprimer le password de l’objet user qu’on va passer dans le payload du token.
                    // eslint-disable-next-line no-underscore-dangle
                    delete rawUser.password;
                    const user = {
                        id: rawUser.id,
                        firstname: rawUser.firstname,
                        lastname: rawUser.lastname,
                        email: rawUser.email,
                        role: rawUser.role,
                        notification: rawUser.notification,
                    };
                    // On crée un token
                    const newToken = createToken(user);

                    // Puis on ajoute le token dans l’entête de la réponse avant de renvoyer le login: true
                    res.header('Authorization', `Bearer ${newToken}`);

                    return res.status(200).json({ login: true });
                }
                // Si les mots de passe ne correspondent pas
                return next(new ApiError('wrong email or password', { statusCode: 403 }));
            });
        }
        // Si on ne trouve pas l'user
        return next(new ApiError('wrong email or password', { statusCode: 403 }));
    },

    async logout(req, res) {
        // Delete the stored token from client side upon log out
        res.removeHeader('Authorization');
        // Disable user token by putting in redis DB
        disableToken(req);
        res.status(200).json({ logout: true });
    },
};

module.exports = userController;
