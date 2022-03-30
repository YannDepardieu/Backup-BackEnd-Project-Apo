const { Router } = require('express');
const backofficeController = require('../controllers/backoffice');

const router = Router();

router.get('/test', backofficeController.test);

module.exports = router;
