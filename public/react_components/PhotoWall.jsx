require('css/style.scss');
require('css/photo_wall.scss');

import {Component} from 'react';
import {render} from 'react-dom';
import _ from 'lodash';

const animationTypes = "bounceIn fadeIn rotateIn zoomIn".split(" "),
    outStyles = "bounceOut fadeOut rotateOut zoomOut".split(" "),
    PHOTO_STATUS_HIDDEN = 'hidden',
    PHOTO_STATUS_SELECTED = 'selected',
    PHOTO_STATUS_SHOW = 'show';

var outStylesIndex = 0;
const host = '';//http://10.24.32.73:224
export default class PhotoWall extends Component {
    constructor(props) {
        super(props);

        // var imageList = this.getMockData();
        var imageList = [];
        this.state = {
            activeDrag: false,
            imageList: imageList || [],
            imageCounter: 0,
            insertIntoWall: false,
            selectedPhoto: null
        };

        window.photoWall = this;

        this.playMessages = [];
        this.cachedMessageIDs = {};

        this.getMemberList();
    }

    componentDidUpdate() {
        if (this.state.imageList.length && !this.playing) {
            this.playPhotoWall();
            this.playing = true;
        }
    }

    componentDidMount() {
    }

    getMockData() {
        var imageList = [], fileNames = 'AbbyTan,Adelle_Yuan,Albert Luo,Allen Peng,AnnyZhang,AnsonXue,Armstrong Liu,BettyWang,Catherine,Claire Xia,Cynthia_gao,Damon Liu,Eric Wang,FrankYang,Gina Zhai,Jason Wang'.split(',');
        for (var i = 0; i < 80; i++) {
            var index = i % fileNames.length;
            var isSayTo = i % 2 === 0;
            imageList.push({
                id: i,
                name: fileNames[index],
                src: '/images/' + fileNames[index] + '.jpg',
                isSayTo: isSayTo,
                isSaying: false,
                intro: 'Employed at Everbridge since Feb 2012 (4 years and 10 months)',
                title: isSayTo ? `Someone says to ${fileNames[index]}:` : `${fileNames[index]} says`,
                comments: isSayTo ? `Hi ${fileNames[index]}, how are you!` : `I'm ${fileNames[index]}, nice to meet you!`,
            });
        }

        _.each(imageList, function (photo, index) {
            photo.style = Object.assign({}, {
                top: Math.floor((index) / 10) * 65 + ((540 - 65 * 8) / 2),
                left: (index % 10) * 107 + (1080 - 107 * 10) / 2
            });
            console.log(JSON.stringify(photo.style));
        });
        console.log(imageList);
        return imageList;
    }

    getMemberList() {
        $.ajax({
            url: host + '/EB/getMemberList',
            type: "GET",
            dataType: 'json'
        }).done(function (response) {

            var model = {
                Avatar: null,
                Department: null,
                Gender: "女",
                ID: "922E6F1D-74DE-4681-87B2-D9BBB0EFC44D",
                JoinDate: "2015-08-24 00:00:00",
                Name: "Abby Tan",
                Title: null
            };
            var imageList = _.map(response.data, function (member) {
                return {
                    ID: member.ID,
                    Name: member.Name,
                    JoinDate: member.JoinDate,
                    src: 'http://www.ihzone.com/everbridge/photowall/public/images/' + member.Name + '.jpg'
                }
            });
            console.log(response);

            _.each(imageList, function (photo, index) {
                photo.style = Object.assign({}, {
                    top: Math.floor((index) / 10) * 65 + ((540 - 65 * 8) / 2),
                    left: (index % 10) * 107 + (1080 - 107 * 10) / 2
                });
                console.log(JSON.stringify(photo.style));
            });
            console.log(imageList);

            var imageListCache = {};
            _.each(imageList, function (image) {
                image.isSaying = false;
                image.intro = 'Intro';
                imageListCache[image.ID] = _.clone(image);
            });
            this.imageListCache = imageListCache;
            this.setState({
                imageList: imageList
            });

            // this.getHiList();

        }.bind(this));
    }

    updateMessageDisplayTime(messageId) {
        delete this.cachedMessageIDs[messageId];
        console.log('Go to remove message: ', messageId);
        console.log('Cached MessageIDs: ', this.cachedMessageIDs);
        $.ajax({
            url: host + '/EB/updateMessageDisplayTime',
            type: "POST",
            data: {
                ID: messageId
            }
        }).done(function (data) {
            console.log('Remove message successfully: ', messageId);
        });
    }

    getHiList() {
        var _this = this,
            imageListCache = this.imageListCache;
        var cachedMessageIDs = this.cachedMessageIDs;
        $.ajax({
            url: host + '/EB/getHiList',
            type: "GET",
            dataType: 'json'
        }).done(function (response) {
            /**
             * {
             *  ID: 0,
             *  MID: 0,
             *  Message: "",
             *  IsSayTo: Boolean,
             *  CreateTime: Date String
             * }
             */
            if (response && response.data && response.data.length) {
                let messages = [];
                _.each(response.data, function (message) {
                    if (cachedMessageIDs[message.ID]) {
                        return;
                    }
                    cachedMessageIDs[message.MID] = true;
                    var image = imageListCache[message.MID];
                    if (image) {
                        image = _.clone(image);
                    }
                    image.isSayTo = message.IsSayTo === 1;
                    image.isSaying = true;
                    image.title = image.isSayTo ? `Someone says to ${image.Name}:` : `${image.Name} says:`;
                    image.comments = message.Message;
                    image.messageID = message.ID;
                    messages.push(image);
                });
                if (messages.length) {
                    _this.playMessages = _this.playMessages.concat(messages);
                    console.log('Get some new messages: ', messages);
                } else {
                    console.log('There is no new messages!');
                }
            } else {
                console.log('There is no new messages!');
            }
        });
    }

    playPhotoWall() {
        if (this.playMessages.length) {
            this.playMessagesPhoto();
            return;
        }
        this.getHiList();
        this.playIndex = this.playIndex || 0;
        var imageList = this.state.imageList || [];
        if (!imageList.length) {
            return;
        }
        function play() {
            if (this.playIndex === imageList.length) {
                this.playIndex = 0;
            }
            var selectedPhoto = null;
            _.each(imageList, function (photo, index) {
                photo.selected = index === this.playIndex;
                if (photo.selected) {
                    selectedPhoto = _.clone(photo);
                    selectedPhoto.status = PHOTO_STATUS_SELECTED
                }
            }.bind(this));

            this.setState({
                imageList: imageList
            });

            this.showPhoto(selectedPhoto, function () {
                this.playPhotoWall();
            }.bind(this));

            this.playIndex++;
        }

        // this.playInterval = setInterval(play.bind(this), 6000);
        play.call(this);
    }

    playMessagesPhoto() {
        if (this.playMessages.length === 0) {
            this.playPhotoWall();
            return;
        }
        console.log('Going to play messages, how many messages ==> ', this.playMessages.length);
        var selectedPhoto = this.playMessages.shift();
        if (!selectedPhoto) {
            return;
        }
        this.updateMessageDisplayTime(selectedPhoto.messageID);
        selectedPhoto.isSaying = true;
        // selectedPhoto.isSayTo = Math.random() > 0.5;
        this.showPhoto(selectedPhoto, function () {
            this.playMessagesPhoto();
        }.bind(this));
        if (this.playMessages.length === 0) {
            this.getHiList();
        }
    }

    showPhoto(selectedPhoto, callback) {
        console.log('Play Photo ==> ', selectedPhoto);

        selectedPhoto.status = PHOTO_STATUS_SELECTED;
        this.setState({
            selectedPhoto: selectedPhoto
        });
        setTimeout(function () {
            selectedPhoto.status = PHOTO_STATUS_SHOW;
            this.setState({
                selectedPhoto: selectedPhoto
            });
            setTimeout(function () {
                this.state.selectedPhoto.status = PHOTO_STATUS_HIDDEN;
                this.setState({
                    selectedPhoto: this.state.selectedPhoto
                });
                setTimeout(function () {
                    callback();
                }.bind(this), 1000);
            }.bind(this), 4000);
        }.bind(this), 1000);
    }

    renderSelectedPhoto(selectedPhoto) {
        let render, className = 'animated photo-show-container photo-hiding';

        // put-down

        if (selectedPhoto) {
            if (selectedPhoto.status === PHOTO_STATUS_SELECTED) {
                className = className
            } else if (selectedPhoto.status === PHOTO_STATUS_SHOW) {
                className = className + ' photo-showing fadeInLeft';
            } else {
                className = 'animated photo-show-container fadeOutRight';
            }
            if (selectedPhoto.isSayTo) {
                className = className + ' saying';
            }
            render = <div className={className}>
                <img src={selectedPhoto.src} className={`view ${(selectedPhoto.isSayTo) ? 'say-to' : ''}`}/>
                <div className="info">
                    <h3>{selectedPhoto.isSaying ? selectedPhoto.title : selectedPhoto.Name}</h3>
                    <p>{selectedPhoto.isSaying ? selectedPhoto.comments : selectedPhoto.intro}</p>
                </div>
            </div>;

        }
        return render;
    }

    renderMessage(selectedPhoto) {
        let render;

        if (selectedPhoto) {
            if (selectedPhoto.status === PHOTO_STATUS_SELECTED) {
                render = <div className={`animated photo-show-container photo-hiding put-down`}>
                    <img src={selectedPhoto.src} className={`view ${(selectedPhoto.isSayTo) ? 'say-to' : ''}`}/>
                    <div className="comments">
                        <h3>{selectedPhoto.title}</h3>
                        <p>{selectedPhoto.comments}</p>
                    </div>
                </div>;
            } else if (selectedPhoto.status === PHOTO_STATUS_SHOW) {
                render = <div className={`animated photo-show-container photo-hiding photo-showing put-down fadeInLeft`}>
                    <img src={selectedPhoto.src} className={`view ${(selectedPhoto.isSayTo) ? 'say-to' : ''}`}/>
                    <div className="comments">
                        <h3>{selectedPhoto.title}</h3>
                        <p>{selectedPhoto.comments}</p>
                    </div>
                </div>;
            } else {
                let outStyle = outStyles[outStylesIndex];
                outStylesIndex++;
                if (outStylesIndex === outStyles.length) {
                    outStylesIndex = 0;
                }
                render = <div className={`animated photo-show-container put-down zoomOut`}>
                    <img src={selectedPhoto.src} className={`view ${(selectedPhoto.isSayTo) ? 'say-to' : ''}`}/>
                    <div className="info">
                        <h3>{selectedPhoto.Name}</h3>
                        <p>{selectedPhoto.info}</p>
                    </div>
                </div>;
            }

        }
        return render
    }

    render() {
        return <div>
            <div ref={(div) => {
                this.photoWallContainer = div
            }} className="photo-wall-container">
                {this.state.imageList.map((image, index) =>
                    <div key={index} className="photo-container" style={image.style}>
                        <img src={image.src} className={`animated ${image.selected ? '' : 'fadeIn'} preview ${image.selected ? 'selected flash' : ''}`}/>
                    </div>
                )}
                {this.renderSelectedPhoto(this.state.selectedPhoto)}
            </div>
        </div>;
    };
}

