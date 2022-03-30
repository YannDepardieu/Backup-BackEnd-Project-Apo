const { Router } = require('express');

const mainApiRouter = require('./api');
const backofficeRouter = require('./backoffice');

const router = Router();

router.use('/main-api', mainApiRouter);

router.use('/backoffice', backofficeRouter);

router.use((_, res) => {
    res.status(404).json({ name: 'API', version: '1.0', status: 404, message: 'not_found' });
});

module.exports = router;
