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
    res.render('photo.uploader.pug', { title: 'Photo Uploader' });
});

router.post('/upload', upload.single('photo'), function (req, res, next) {
    if (req.file) {
        console.log(req.file);
        res.end('Upload Success!');
    } else {
        res.end('Upload Error!');
    }
});

router.post('/wall',function (req, res, next) {
    res.render('photo.wall.pug', { title: 'Photo Wall' });
});

module.exports = router;
