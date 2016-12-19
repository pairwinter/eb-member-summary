/**
 * Created by damon on 10/12/2016.
 */
Logger.useDefaults();
(function(){

    var imageSize = [300, 300],
        windowSize = [1080, 540],
        cutAreaStart = [390, 120],
        cutAreaEnd = [690, 420];



    var cLogger = Logger.get('canvasLogger');
    cLogger.setLevel(Logger.DEBUG);
    var PictureCut = function (canvasId) {
        var canvas = document.getElementById(canvasId);
        this.dom = canvas;
        this.jDom = $(this.dom);
        this.width = this.jDom.width();
        this.height = this.jDom.height();
        cLogger.debug(`canvas (${this.width}, ${this.height})`);
        var ctx = canvas.getContext('2d');
        this.ctx = ctx;

        this.cutArea = {
            start: {
                x: cutAreaStart[0],
                y: cutAreaStart[1]
            },
            end: {
                x: cutAreaEnd[0],
                y: cutAreaEnd[1]
            }
        }
    };

    PictureCut.prototype.drawRect = function () {
        this.ctx.fillStyle = '#ccc';
        this.ctx.fillRect(0, 0, canvas.dom.width, canvas.dom.height);
    };

    PictureCut.prototype.drawArc = function () {
        var ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(100, 100, 50, 0,  Math.PI, true);
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = "#000";
        ctx.closePath();
        ctx.fill()
    };

    PictureCut.prototype.drawPicture = function (pictureId) {
        var picture = new Image();
        picture.src = `/images/${pictureId || 2}.jpg`;
        var dom = this.dom,
            ctx = this.ctx,
            _this = this;
        picture.onload = function () {
            cLogger.debug(`${picture.src} loaded`);
            _this.originalImage = this;

            var pWidth = this.width,
                pHeight = this.height;

            var startX = (_this.width - this.width)/2,
                startY = (_this.height - this.height)/2
            ctx.drawImage(this, startX, startY);
        };
    };

    PictureCut.prototype.loadPicture = function (pictureId) {
        var picture = new Image();
        picture.src = `/images/${pictureId || 2}.jpg`;
        var dom = this.dom,
            ctx = this.ctx,
            _this = this,
            jPicture = $(picture),
            picturePosition = this.picturePosition = {},
            pictureCutPosition = this.pictureCutPosition = {start:{x:0, y:0}, end:{x:0, y:0}};
        picture.onload = function () {

            var width = imageSize[0],
                height = imageSize[1];
            if(this.width > this.height){
                this.width = this.width * (height/this.height);
                this.height = height;
            }else{
                this.height = this.height * (width/this.width);
                this.width = width;
            }


            cLogger.debug(`${picture.src} loaded`);
            _this.originalImage = this;
            var startX = (_this.width - this.width)/2,
                startY = (_this.height - this.height)/2;
            // ctx.drawImage(this, startX, startY);
            picturePosition.left = startX;
            picturePosition.top = startY;

            pictureCutPosition.start.x = Math.min(_this.cutArea.start.x - picturePosition.left, 0);
            pictureCutPosition.start.y = Math.min(_this.cutArea.start.y - picturePosition.top, 0);

            pictureCutPosition.end.x = Math.min(_this.cutArea.end.x - picturePosition.left, 0);
            pictureCutPosition.end.y = _this.cutArea.end.y - picturePosition.top;


            $(picture).css({left: startX, top: startY});
            _this.jDom.after(picture);
        };
        jPicture.mousedown(function (e) {
            picturePosition.move = true;
            picturePosition.mousePosition = {
                x: e.pageX,
                y: e.pageY
            }
        });
        jPicture.mouseup(function (e) {
            picturePosition.move = false;
        });
        jPicture.mouseleave(function (e) {
            picturePosition.move = false;
        });
        jPicture.mouseout(function (e) {
            picturePosition.move = false;
        });
        jPicture.mousemove(function (e) {
            e.stopPropagation();
            e.preventDefault();
            var mousePosition = picturePosition.mousePosition;

            if(!mousePosition || !picturePosition.move){
                return;
            }

            var changeX = e.pageX - mousePosition.x,
                changeY = e.pageY - mousePosition.y,
                newLeft = picturePosition.left + changeX,
                newTop = picturePosition.top + changeY;

            if(newLeft > 390 || newLeft + jPicture.width() < 690){
                newLeft = picturePosition.left;
            }
            if(newTop > 120 || newTop + jPicture.height() < 420){
                newTop = picturePosition.top;
            }


            picturePosition.left = newLeft;
            picturePosition.top = newTop;

            jPicture.css({left: picturePosition.left, top: picturePosition.top});
            mousePosition.x = e.pageX;
            mousePosition.y = e.pageY;

        });

        jPicture.bind('mousewheel', function (e) {
            cLogger.debug(e.originalEvent.detail, e.originalEvent.wheelDelta);
            var width = jPicture.width(),
                height = jPicture.height(),
                newWidth,
                newHeight;
            if(e.originalEvent.wheelDelta > 0){

                newWidth = width * 1.02;
                newHeight = height * 1.02;

                // picturePosition.left = picturePosition.left - (picturePosition.left * 1)

            }else if(e.originalEvent.wheelDelta < 0){
                newWidth = width / 1.02;
                newHeight = height / 1.02;
                if( newWidth < 300){
                    newWidth = 300;
                    newHeight = height / (width/newWidth);
                }else if(newHeight < 300){
                    newHeight = 300;
                    newWidth = width / (height/newHeight);
                }
                if(newHeight + picturePosition.top < 420){
                    picturePosition.top = 420 - newHeight;
                    jPicture.css({top: picturePosition.top});
                }
                if(newWidth + picturePosition.left < 690){
                    picturePosition.left = 690 - newWidth;
                    jPicture.css({left: picturePosition.left});
                }

            }

            if(newWidth > 1080 || newHeight > 540){
                return;
            }

            jPicture.width(newWidth);
            jPicture.height(newHeight);
        });
    };

    PictureCut.prototype.getCutPicture = function () {

    }





    var pictureCut = new PictureCut('practice'), ctx = pictureCut.ctx;
    // pictureCut.drawRect()
    // pictureCut.drawPicture();
    pictureCut.loadPicture();
})();
