// import style from 'css/style.scss';

import {Component} from 'react';
import {render} from 'react-dom';
import _ from 'lodash';

require('css/style.scss');
require('css/photo_uploader.scss');

// require("style-loader!raw-loader!sass-loader!css/style.scss");

const acceptedTypes = {
    'image/png': true,
    'image/jpeg': true,
    'image/gif': true
};
const screenSize = {
    width: 1080.0,
    height: 540.0,
}, photoShowSize = 500.0, photoThumbnailSize=108;
var imageIndex =0;
const animationTypes = "bounceIn fadeIn rotateIn zoomIn".split(" ");
var cLogger = Logger.get('canvasLogger');
cLogger.setLevel(Logger.DEBUG);
export default class PhotoUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user:{},
            idValid: false,
            activeDrag: false,
            imageList: [],
            imageCounter: 0,
            insertIntoWall: false,
            pictures:[]
        };

        this.cache = {
            image:{
                isMove: false,
                position:{
                    x: 0,
                    y:0
                },
                mousePosition:{
                    x:0,
                    y:0
                }
            }
        };
    }

    componentDidMount(){
        this.domMemberId.focus();
    }

    openFullScreen(e){
        if(document.fullScreen || document.webkitIsFullScreen){
            document.webkitCancelFullScreen();
        }else{
            this.dragArea.webkitRequestFullScreen();
        }

    }

    handleOnClick(e) {
        console.log('handleOnClick', e);
        // this.setState({activeDrag : !this.state.activeDrag});
    }

    handleOnDragEnter(e) {
        e.preventDefault();
        // console.log('handleOnDragEnter', e);
        if (!this.state.activeDrag) {
            this.setState({activeDrag: true});
        }
    }

    handleOnDragOver(e) {
        e.preventDefault();
        console.log('handleOnDragOver', e);
        if (!this.state.activeDrag) {
            this.setState({activeDrag: true});
        }
    }

    handleOnDragLeave(e) {
        e.preventDefault();
        console.log('handleOnDragLeave', e);
        if (this.state.activeDrag) {
            this.setState({activeDrag: false});
        }
    }

    handleOnDragExit(e) {
        e.preventDefault();
        console.log('handleOnDragExit', e);
        if (this.state.activeDrag) {
            this.setState({activeDrag: false});
        }
    }

    handleOnDragEnd(e) {
        e.preventDefault();
        console.log('handleOnDragEnd', e);
        if (this.state.activeDrag) {
            this.setState({activeDrag: false});
        }
    }

    handleOnDrop(e) {
        e.preventDefault();
        console.log('handleOnDrop', e);
        let files = e.dataTransfer.files, //FileList
            formData = new FormData();
        if (files && files.length) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i]; //File
                console.log(file);
                formData.append('file', file);
                this.previewFile(file);
            }
        }
        if (this.state.activeDrag) {
            this.setState({activeDrag: false});
        }
    }

    previewFile(file) {
        if (acceptedTypes[file.type] === true) {
            let fileReader = new FileReader(),
                _this = this,
                imageCounter = this.state.imageCounter,
                imageList = this.state.imageList;
            imageCounter++;
            this.state.imageCounter = imageCounter;
            fileReader.onload = function (onloadEvent) {
                var image = {};
                image.index = imageIndex;
                imageIndex += 1;
                image.src = onloadEvent.target.result;
                image.animationType = animationTypes[(imageCounter - 1) % (animationTypes.length)];
                imageList = [];
                _this.setState({
                    imageList: imageList
                });
                imageList.push(image);
                var imageDom = new Image();
                imageDom.src = image.src;

                imageDom.onload = function() {
                    var width = this.width,
                        height = this.height,
                        top, left;
                    console.log(width, height);
                    if(width < height){
                        image.width = photoShowSize;
                        image.height = this.height * (photoShowSize/width);

                        if(image.height > screenSize.height){
                            image.width = this.width * (screenSize.height/height);
                            image.height = screenSize.height;
                        }
                    }else{
                        image.height = photoShowSize;
                        image.width = this.width * (photoShowSize/height);

                        if(image.width > screenSize.width){
                            image.height = this.height * (screenSize.width/width);
                            image.width = screenSize.width;
                        }
                    }
                    image.top = screenSize.height/2 - image.height/2;
                    image.left = screenSize.width/2 - image.width/2;
                    image.style = Object.assign(image.style || {}, {imageIndex: imageIndex, width: image.width, height: image.height, top:image.top, left: image.left});
                    _this.setState({
                        imageList: imageList
                    });
                    _.delay(function () {
                        _this.registerPictureCut();
                    },500);
                    /*
                    setTimeout(function () {
                        image.insertIntoWall = true;
                        _this.setState({
                            imageList: imageList
                        });
                        setTimeout(function () {
                            image.style = Object.assign(_.clone(image.style),
                                {
                                    width: photoThumbnailSize,
                                    height: image.height * (photoThumbnailSize/image.width),
                                    top:photoThumbnailSize * (Math.floor(image.index/10)%10),
                                    left: photoThumbnailSize*(image.index%10),
                                    transform:`rotate(360deg)`
                                });
                            var imageList = _this.state.imageList;
                            _this.setState({
                                imageList: imageList
                            });
                        },100);
                        // setTimeout(function () {
                        //     _this.setState({
                        //         insertIntoWall: false
                        //     });
                        // }, 2050);
                    }, 2000)
                    */
                };
            };
            fileReader.readAsDataURL(file);
        }
    }


    registerPictureCut(){
        // debugger;
        var _this = this,
            state = this.state;
        var jPicture = $(this.imgDom),
            jCutButton = $(this.cutButton);
        var picturePosition = state.picturePosition = {
            move: false,
            left: this.state.imageList[0].left,
            top: this.state.imageList[0].top,
            mousePosition: undefined,
            width: this.state.imageList[0].width,
            height: this.state.imageList[0].height
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
            jCutButton.show();
        });
        jPicture.mouseleave(function (e) {
            picturePosition.move = false;
            jCutButton.show();
        });
        jPicture.mouseout(function (e) {
            picturePosition.move = false;
            jCutButton.show();
        });
        jPicture.mousemove(function (e) {
            e.preventDefault();
            var mousePosition = picturePosition.mousePosition;

            if(!mousePosition || !picturePosition.move){
                return;
            }

            jCutButton.hide();

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
            state.picturePosition = picturePosition;
            jPicture.css({left: picturePosition.left, top: picturePosition.top});

            mousePosition.x = e.pageX;
            mousePosition.y = e.pageY;

        });

        jPicture.bind('mousewheel', function (e) {
            cLogger.debug(e.originalEvent.detail, e.originalEvent.wheelDelta);
            var width = jPicture.width(),
                height = jPicture.height(),
                newWidth = width,
                newHeight = height;
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

            }else{

            }

            if(newWidth > 1080 || newHeight > 540){
                return;
            }

            jPicture.width(newWidth);
            jPicture.height(newHeight);

            picturePosition.height = newHeight;
            picturePosition.width = newWidth;

            state.picturePosition = picturePosition;
        });
    }

    cutPicture(){
        var _this = this,
            picturePosition = this.state.picturePosition,
            left = picturePosition.left,
            top = picturePosition.top,
            width = picturePosition.width,
            height = picturePosition.height,
            imageObject = this.state.imageList[0],
            jUploaderContainer = $(this.dragArea),
            jPictureContainer = $(this.pictureContainer);
        var imageDom = new Image();
        imageDom.src = imageObject.src;
        imageDom.onload = function () {
            this.width = width;
            this.height = height;
            var canvas = $('<canvas class="selected-picture"/>');
            // canvas.appendTo('body');
            canvas[0].width = width;
            canvas[0].height = height;

            var ctx = canvas[0].getContext('2d');
            ctx.drawImage(this, 0, 0, width, height);
            // ctx.drawImage(this, 0, 0, 300, 300, width-(390-left), height - (120 - top), 300, 300);

            var cutDate = ctx.getImageData(390-left, 120 - top, 300, 300);
            canvas[0].width = 300;
            canvas[0].height = 300;
            ctx.putImageData(cutDate, 0, 0);
            var picture = {
                src: canvas[0].toDataURL()
            };
            _this.setState({
                pictures:[picture]
            });
            jUploaderContainer.hide();
            jPictureContainer.show();
            // _.delay(function () {
            //     jUploaderContainer.append(canvas);
            // },3000)
        }

    }
    reselectPicture(){
       var jUploaderContainer = $(this.dragArea),
           jPictureContainer = $(this.pictureContainer);
        jUploaderContainer.show();
        jPictureContainer.hide();
    }

    savePicture(){
        var picture = this.state.pictures[0].src;
        // $.post('photos/savePicture', {
        //     id: 0,
        //     picture: picture
        // }, function (data) {
        //     console.log(data);
        // });
        var jUploaderContainer = $(this.dragArea),
            jPictureContainer = $(this.pictureContainer),
            jPictureThankYouContainer = $(this.pictureThankYouContainer);
        jPictureContainer.find('img').removeClass('zoomIn').addClass('fadeOutRight');
        jPictureContainer.find('div.picture-bottom').addClass('animated').addClass('fadeOutDown');

        var member = this.state.user;
        $.ajax ({
            url: 'photos/savePicture',
            type: "POST",
            data: JSON.stringify({
                member: member,
                picture: picture
            }),
            contentType: "application/json; charset=utf-8"
        }).done(function(data){
            console.log(data);
            jPictureThankYouContainer.addClass('bounceIn').show();
        });

    }

    idOKClick(e){
        if(!this.domMemberId.value){

            return;
        }
        var _this = this;
        $.ajax ({
            url: 'photos/validUser',
            type: "POST",
            data: JSON.stringify({
                id: this.domMemberId.value
            }),
            contentType: "application/json; charset=utf-8",
            dataType:'json'
        }).done(function(data){
            if(data.status === 'success'){
                _this.setState({idValid: true, user: data.user});
            }
        });
    }
    render() {
        return <div ref={(container) => {this.container = container}}>
            <div className={`animated valid-id-container bounceInDown ${this.state.idValid ? 'fadeOutDown' : ''}`}>
                <h1>Please input your China National ID Number</h1>
                <input className="id-input" ref={(input) => {this.domMemberId = input}}/>
                <button className="id-ok" type="button" onClick={this.idOKClick.bind(this)} value="OK">OK</button>
            </div>
            <div ref={(div) => { this.dragArea = div; }}
                 draggable="draggable"
                 className={`uploader-container ${this.state.idValid ? 'id-valid' : ''} ${this.state.imageList.length > 0 ? 'has-child' : ''} ${this.state.activeDrag ? 'drag-over' : ''}`}
                 onClick={this.handleOnClick.bind(this)}
                 onDragOver={this.handleOnDragOver.bind(this)}
                 onDragEnd={this.handleOnDragEnd.bind(this)}
                 onDrop={this.handleOnDrop.bind(this)}
                 onDragEnter={this.handleOnDragEnter.bind(this)}
                //onDragStart={(e) => e.preventDefault()}
                 onDragLeave={this.handleOnDragLeave.bind(this)}
                 onDragExit={this.handleOnDragExit.bind(this)}
                 onDrag={(e) => e.preventDefault()}
                 onDoubleClick={this.openFullScreen.bind(this)}
            >
                <div className="border"></div>
                <h1 className={`uploader-tip animated bounceInDown`}>
                    Welcome {this.state.user.fullName}, please drag your picture here to upload!
                </h1>
                {this.state.imageList.map((image, index) =>
                    <img ref={(img) => this.imgDom = img} key={index} src={image.src} className={`${image.insertIntoWall ? '' : `animated ${image.animationType}`}  photo-preview-img-style ${image.insertIntoWall ? 'move-into-photo-wall-transition' : ''}`} style={image.style}/>
                )}
                <div className="top"></div>
                <div className="right"></div>
                <div className="bottom"><button ref={(cutButton) => {this.cutButton = cutButton;}} type="button" onClick={this.cutPicture.bind(this)}>Use this as my picture</button></div>
                <div className="left"></div>

            </div>
            <div ref={(div) => {this.pictureContainer = div}} className="picture-container">
                {this.state.pictures.map((picture, index) =>
                    <img key={index} src={picture.src} className="animated zoomIn selected-picture"/>
                )}
                <div className="picture-bottom">
                    <button ref={(button) => {this.saveButton = button;}} type="button" onClick={this.savePicture.bind(this)}>Yes! Save my picture</button>
                    <button ref={(button) => {this.pictureButton = button;}} type="button" onClick={this.reselectPicture.bind(this)}>Re-Select</button>
                </div>
                <div ref={(div) => {this.pictureThankYouContainer = div}} className="animated picture-thank-you">
                    Thank You, {this.state.user.fullName}!
                </div>
            </div>
        </div>
        ;
    };
}

