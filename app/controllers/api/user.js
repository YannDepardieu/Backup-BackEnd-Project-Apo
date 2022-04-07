// const debug = require('debug')('userController');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

const { SECRET_KEY } = process.env;
const userController = {
    /**
     * Api controller to get one user myth by its ID.
     * ExpressMiddleware signature
     * @param {object} req Express req.object
     * @param {object} res Express response object
     * @return {string} Route API JSON data
     */
    async auth(req, res) {
        const { email, password } = req.body;
        // On recherche notre utilisateur grâce à son email
        const user = await User.findOne({ email }, '-__v -createdAt -updatedAt');
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
                    delete user._doc.password;

                    const expiresIn = 24 * 60 * 60;
                    // On signe ensuite le token avec toutes nos infos et la clé secrète,
                    const token = jwt.sign({ user }, SECRET_KEY, { expiresIn });

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
};

module.exports = userController;
