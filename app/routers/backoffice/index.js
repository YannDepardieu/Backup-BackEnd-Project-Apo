const { Router } = require('express');
const backofficeController = require('../../controllers/backoffice/backoffice');

const router = Router();

router.get('/test', backofficeController.test);

router.use((_, res, next) => {
    res.type('html');
    next();
});

router.get('/', backofficeController.home);

module.exports = router;
