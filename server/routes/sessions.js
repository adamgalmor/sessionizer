const express = require('express');
const router = express.Router();
const session = require('../controller/session');

router.get('/', session.collect);

module.exports = router;
