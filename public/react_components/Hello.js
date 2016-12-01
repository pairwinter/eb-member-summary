import { Component } from 'react';
import { render } from 'react-dom';

export default class Hello extends Component {
    render() {
        return React.createElement(
            'h1',
            null,
            'Hello, word! ',
            React.createElement(
                'span',
                null,
                'Damon'
            ),
            ' ',
            React.createElement(
                'span',
                null,
                'Liu'
            )
        );
    }
}