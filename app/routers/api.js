// const debug = require('debug')('router:api');
const express = require('express');
const apiController = require('../controllers/api');

const router = express.Router();

router.get('/test', apiController.test);

module.exports = router;
