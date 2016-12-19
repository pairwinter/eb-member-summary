require('css/style.scss');
require('css/photo_wall.scss');

import {Component} from 'react';
import {render} from 'react-dom';
import _ from 'lodash';

const animationTypes = "bounceIn fadeIn rotateIn zoomIn".split(" ");

export default class PhotoWall extends Component {
    constructor(props) {
        super(props);
        var imageList = [{
            id:1,
            name: 'Damon Liu',
            src: '/images/1.png'
        },{
            id:2,
            name: 'Tom Zhang',
            src: '/images/2.png'
        },{
            id:3,
            name: 'Jerry Wang',
            src: '/images/3.png'
        }];
        imageList = imageList.concat(imageList);
        imageList = imageList.concat(imageList);
        imageList = imageList.concat(imageList);
        imageList = imageList.concat(imageList);
        _.each(imageList,function (photo, index) {
            photo.style = Object.assign({},{
                top: Math.floor((index)/10) * 51 + 'px'
            });
        })
        this.state = {
            activeDrag: false,
            imageList: imageList,
            imageCounter: 0,
            insertIntoWall: false
        };
    }

    render() {
        return <div>
            <div ref={(div) => {this.photoWallContainer = div}} className="photo-wall-container">
                {this.state.imageList.map((image, index) =>
                    <div key={index} className="photo-container" style={image.style}>
                    <img src={image.src}
                         className={`animated fadeIn photo-preview-img-style`}/>
                    </div>
                )}
            </div>

            <div ref={(div) => {this.photoShowContainer = div}} className="photo-show-container">

            </div>

        </div>;
    };
}

