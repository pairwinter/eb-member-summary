// import style from 'css/style.scss';

import {Component} from 'react';
import {render} from 'react-dom';
import _ from 'lodash';

require('css/style.scss');

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

export default class PhotoUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeDrag: false,
            imageList: [],
            imageCounter: 0,
            insertIntoWall: false
        };
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
        // console.log('handleOnDragOver', e);
        if (!this.state.activeDrag) {
            this.setState({activeDrag: true});
        }
    }

    handleOnDragLeave(e) {
        e.preventDefault();
        // console.log('handleOnDragOver', e);
        if (this.state.activeDrag) {
            this.setState({activeDrag: false});
        }
    }

    handleOnDragExit(e) {
        e.preventDefault();
        // console.log('handleOnDragOver', e);
        if (this.state.activeDrag) {
            this.setState({activeDrag: false});
        }
    }

    handleOnDragEnd(e) {
        e.preventDefault();
        // console.log('handleOnDragEnd', e);
        if (this.state.activeDrag) {
            this.setState({activeDrag: false});
        }
    }

    handleOnDrop(e) {
        e.preventDefault();
        // console.log('handleOnDrop', e);
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
                imageList.push(image);
                var imageDom = new Image();
                imageDom.src = image.src;

                imageDom.onload = function() {
                    var width = this.width,
                        height = this.height,
                        top, left;
                    console.log(width, height);
                    if(width > height){
                        image.width = photoShowSize;
                        image.height = this.height * (photoShowSize/width);
                    }else{
                        image.height = photoShowSize;
                        image.width = this.width * (photoShowSize/height);
                    }
                    image.top = screenSize.height/2 - image.height/2;
                    image.left = screenSize.width/2 - image.width/2;
                    image.style = Object.assign(image.style || {}, {width: image.width, height: image.height, top:image.top, left: image.left});
                    _this.setState({
                        imageList: imageList
                    });
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
                };
            };
            fileReader.readAsDataURL(file);
        }
    }

    render() {
        return <div ref={(div) => { this.dragArea = div; }}
            draggable="draggable"
            className={`uploader-container ${this.state.imageList.length > 0 ? 'has-child' : ''} ${this.state.activeDrag ? 'drag-over' : ''}`}
            onClick={this.handleOnClick.bind(this)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnd={this.handleOnDragEnd.bind(this)}
            onDrop={this.handleOnDrop.bind(this)}
            onDragEnter={this.handleOnDragEnter.bind(this)}
            //onDragStart={(e) => e.preventDefault()}
            onDragLeave={this.handleOnDragLeave.bind(this)}
            onDragExit={this.handleOnDragExit.bind(this)}
            onDrag={(e) => e.preventDefault()}
            onDoubleClick={this.openFullScreen.bind(this)}
        >
            <h1 className={`uploader-tip animated bounceInDown`}>Drag you picture here to upload!</h1>
            {this.state.imageList.map((image, index) =>
                <img key={index} src={image.src} className={`${image.insertIntoWall ? '' : `animated ${image.animationType}`}  photo-preview-img-style ${image.insertIntoWall ? 'move-into-photo-wall-transition' : ''}`} style={image.style}/>
            )}
        </div>;
    };
}

