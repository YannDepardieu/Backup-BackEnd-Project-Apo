const { Router } = require('express');
const backofficeController = require('../../controllers/backoffice/backoffice');
const BackofficeError = require('../../errors/backofficeError');

const router = Router();

router.get('/test', backofficeController.test);

router.use((_, res, next) => {
    res.type('html');
    next();
});

router.get('/', backofficeController.home);

router.use(() => {
    throw new BackofficeError('Page introuvable', { statusCode: 404 });
});

module.exports = router;
