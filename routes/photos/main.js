var express = require('express');
var router = express.Router();

var multer = require('multer');
var dest = process.env.upload_dest || './upload_dest/';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, dest);
    },
    filename:function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var uploadOptions = {
    // dest: dest,
    storage: storage,
    limits: {
        fieldSize: 1024*1024,
        fileSize: 5*1024*1024
    }
};

var upload = multer(uploadOptions);

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource, here is the hode of photos manager');
});

router.post('/upload', upload.single('photo'), function (req, res, next) {
    if (req.file) {
        console.log(req.file);
        res.end('Upload Success!');
    } else {
        res.end('Upload Error!');
    }
});

module.exports = router;
