// import style from 'css/style.scss';

import {Component} from 'react';
import {render} from 'react-dom';
import _ from 'lodash';

const animationTypes = "bounceIn fadeIn rotateIn zoomIn".split(" ");

export default class PhotoWall extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeDrag: false,
            imageList: [
                {
                    id:1,
                    name: 'Damon Liu',
                    src: '/images/1.jpg'
                },{
                    id:2,
                    name: 'Tom Zhang',
                    src: '/images/2.jpg'
                },{
                    id:3,
                    name: 'Jerry Wang',
                    src: '/images/3.jpg'
                }
            ],
            imageCounter: 0,
            insertIntoWall: false
        };
    }

    render() {
        return <div>
            {this.state.imageList.map((image, index) =>
                <img key={index} src={image.src}
                 className={`animated ${image.animationType} photo-preview-img-style`}/>
            )}
        </div>;
    };
}

