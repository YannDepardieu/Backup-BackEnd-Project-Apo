const { Router } = require('express');

const backofficeRouter = require('./backoffice');
const apiRouter = require('./api');

const router = Router();

router.use('/backoffice', backofficeRouter);

router.use('/api', apiRouter);

router.use((_, res) => {
    res.status(404).json({ name: 'API', version: '1.0', status: 404, message: 'not_found' });
});

module.exports = router;
