var express = require('express');
var request = require('request');
var router = express.Router();
var querystring = require('querystring');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/EB/getMemberList', function(req, res, next) {
    request('http://www.ihzone.com/EB/getMemberList', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.end(body); // Show the HTML for the Google homepage.
        }
    });
});
/* GET home page. */
router.get('/EB/getHiList', function(req, res, next) {
    request('http://www.ihzone.com/EB/getHiList', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.end(body);
        }
    });
});

/* GET home page. */
router.post('/EB/updateMessageDisplayTime', function(req, res, next) {
    var ID = req.body.ID;
    request.post('http://www.ihzone.com/EB/updateMessageDisplayTime',{form: {'ID':ID}}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.end(body);
        }
    });
});


/* GET home page. */
router.get('/lab/canvas', function(req, res, next) {
    res.render('lab/canvas.pug', { title: 'Canvas' });
});

module.exports = router;
