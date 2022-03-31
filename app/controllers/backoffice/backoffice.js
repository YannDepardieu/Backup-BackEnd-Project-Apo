module.exports = {
    test(_, res) {
        res.status(200).json({
            name: 'Backoffice',
            version: '1.0',
            status: 200,
            message: 'Bienvenue sur le Backoffice !',
        });
    },
    /**
     * Home controller which display documentation link.
     * ExpressMiddleware signature
     * @param {object} _ Express request object (not used)
     * @param {object} res Express response object
     * @returns {string} Route API JSON response
     */
    home(_, res) {
        res.render('home', { title: 'Starry Night Backoffice Home' });
    },
};
