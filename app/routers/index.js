const { Router } = require('express');
const debug = require('debug')('main-router');

const mainApiRouter = require('./api');
const backofficeRouter = require('./backoffice');
const errorHandler = require('../middlewares/errorHandler');

const router = Router();

router.use('/main-api', mainApiRouter);

router.use('/backoffice', backofficeRouter);

router.use((err, _, response, next) => {
    debug('40444');
    errorHandler(err, response, next);
});

router.use((_, res) => {
    res.status(404).json({ name: 'General', version: '1.0', status: 404, message: 'not_found' });
});

module.exports = router;
