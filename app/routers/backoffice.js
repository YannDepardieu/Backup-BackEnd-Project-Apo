const { Router } = require('express');

const router = Router();

router.get('/test', (_, res) => {
    res.status(200).json({
        name: 'Backoffice',
        version: '1.0',
        status: 200,
        message: 'Bienvenue sur le Backoffice !',
    });
});

module.exports = router;
