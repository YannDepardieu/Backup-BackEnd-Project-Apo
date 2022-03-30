module.exports = {
    test(_, res) {
        res.status(200).json({
            name: 'API',
            version: '1.0',
            status: 200,
            message: "Bienvenue sur l'API !",
        });
    },
};
