// const debug = require('debug')('router:api');
const express = require('express');

const router = express.Router();

router.get('/test', async (_, res) => {
    res.status(200).json({
        name: 'API',
        version: '1.0',
        status: 200,
        message: "Bienvenue sur l'API !",
    });
});

module.exports = router;
