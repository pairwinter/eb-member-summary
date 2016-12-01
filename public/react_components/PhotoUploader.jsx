import {Component} from 'react';
import {render} from 'react-dom';

export default class PhotoUploader extends Component{
    constructor(props){
        super(props);
        this.state = {
            activeDrag: false
        };
    }
    handleDragOver(e){
        this.state.activeDrag = true;
        return false;
    }
    handleDragEnd(e){
        this.state.activeDrag = false;
        return false;
    }
    handleDrag(){

    }
    render() {
        return <div
            className={this.state.activeDrag?'drag':''}
            onDragOver={this.handleDragOver.bind(this)}
            onDragEnd={this.handleDragEnd.bind(this)}
            onDrag={this.handleDrag.bind(this)}
        >
        </div>;
    };
}

