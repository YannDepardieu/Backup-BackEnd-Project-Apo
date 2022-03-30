module.exports = {
    test(_, res) {
        res.status(200).json({
            name: 'API',
            version: '1.0',
            status: 200,
            message: "Bienvenue sur l'API !",
        });
    },
    /**
     * Default API controller to show documention url.
     * ExpressMiddleware signature
     * @param {object} req Express request object (not used)
     * @param {object} res Express response object
     * @returns {string} Route API JSON response
     */
    home(req, res) {
        const fullUrl = `${req.protocol}://${req.get('host')}`;
        return res.json({
            documentation_url: `${fullUrl}${process.env.API_DOCUMENTATION_ROUTE}`,
        });
    },
};
