var express = require('express');
var router = express.Router();
var fs = require("fs-extra");
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

router.post('/savePicture', function (req, res, next) {
    console.log(req.body);
    var id = req.body.id,
        pictureDataURL = req.body.picture;
    if (pictureDataURL) {
        console.log(pictureDataURL);

        fs.writeJson(dest + "/" + id+'.json', req.body,function (err) {
            if(err){
                console.log(err);
                res.end('Upload Error!');
            }else{
                res.end('Upload Success!');
            }

        })
    } else {
        res.end('Upload Error!');
    }
});



router.get('/wall',function (req, res, next) {
    var model = {
        title: 'Photo Wall',
        photos:[]
    };
    fs.walk(dest)
        .on('data', function (item) {
            fs.readJson(item.path, function (err, photo) {
                model.photos.push(photo);
            });
        })
        .on('end', function () {
            res.render('photo.wall.pug', model);
        });
});

module.exports = router;
