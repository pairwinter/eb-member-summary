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
const animationTypes = "bounceIn fadeIn rotateIn zoomIn".split(" ");

export default class PhotoUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeDrag: false,
            imageList: [],
            imageCounter:0
        };
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
                imageCounter = this.state.imageCounter;
            imageCounter++;
            this.state.imageCounter = imageCounter;
            this.setState({
                beforeInsertToList:false
            });
            fileReader.onload = function (onloadEvent) {
                var image = {};
                image.src = onloadEvent.target.result;
                image.animationType = animationTypes[(imageCounter-1)%(animationTypes.length)];
                _this.setState({
                    imageList: [image]
                });
                setTimeout(function () {
                    _this.setState({
                        beforeInsertToList:true
                    })
                },2000)
            };
            fileReader.readAsDataURL(file);
        }
    }

    render() {
        return <div
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
        >
            {this.state.imageList.map((image, index) =>
                <div key={index} className="photo-preview-container-style">
                    <img src={image.src} className={`animated ${image.animationType} photo-preview-img-style ${this.state.beforeInsertToList===true?"beforeInsertToList insertToList":""}`}></img>
                </div>
            )}
        </div>;
    };
}

