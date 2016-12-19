var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/lab/canvas', function(req, res, next) {
    res.render('lab/canvas.pug', { title: 'Canvas' });
});

module.exports = router;
