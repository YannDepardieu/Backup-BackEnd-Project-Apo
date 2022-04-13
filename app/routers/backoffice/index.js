const { Router } = require('express');
const backofficeController = require('../../controllers/backoffice/backoffice');
const BackofficeError = require('../../errors/backofficeError');

const router = Router();

router.get('/test', backofficeController.test);

router.use((_, res, next) => {
    res.type('html');
    next();
});

/** Route to go to the backoffice of the app and access documentation
 * GET /v1/backoffice/
 * @summary Get backoffice homepage
 * @return {string} 200 - success response - html
 */
router.get('/', backofficeController.home);

// By throwing an error, this middleware allows to go inside the 4 parameter middleware inside the index router
router.use(() => {
    throw new BackofficeError('Page introuvable', { statusCode: 404 });
});

module.exports = router;
