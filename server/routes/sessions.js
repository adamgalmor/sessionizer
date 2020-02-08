var express = require('express');
var router = express.Router();
var session = require('../controller/session');

router.get('/', session.collect);

module.exports = router;
