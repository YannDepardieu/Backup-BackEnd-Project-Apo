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
 * @tags Backoffice
 * @return {string} 200 - success response - html
 */
router.get('/', backofficeController.home);

// Gestion erreurs :Pour entrer dans le middleware handleError à 4 paramètres (error, request, response, next)
// il faut throw une erreur qq part avant. Ici on traverse donc ce middleware et on va dans handleError
router.use(() => {
    throw new BackofficeError('Page introuvable', { statusCode: 404 });
});

module.exports = router;
