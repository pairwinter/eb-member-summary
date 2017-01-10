var express = require('express');
var path = require('path');
var router = express.Router();
var fs = require("fs-extra");
var multer = require('multer');
var dest = process.env.upload_dest || './upload_dest/';
var _ = require('lodash');
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

/* valid user. */
router.post('/validUser', function (req, res, next) {
    var id = req.body.id;
    var membersJsonPath = path.resolve(__dirname, '../../member_data/members.json');
    console.log(membersJsonPath);
    fs.readJson(membersJsonPath, function (err, membersJson) {
        if(err){
            res.end(JSON.stringify({
                status:'error'
            }))
        }else{
            var members = membersJson;
            // var members2 = _.map(members,function (memberArray) {
            //     return {
            //         fullName: memberArray[0],
            //         firstName: memberArray[1],
            //         lastName: memberArray[2],
            //         email: memberArray[3],
            //         startDate: memberArray[4],
            //         jobTitle: memberArray[5],
            //         department: memberArray[6],
            //         guid: memberArray[7],
            //         id: memberArray[8]
            //     }
            // });
            //
            // console.log(JSON.stringify(members2));

            var member = _.find(members, {id: id});
            res.end(JSON.stringify({
                status:'success',
                user:member
            }))
        }

    });
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
    var id = req.body.member.id,
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
