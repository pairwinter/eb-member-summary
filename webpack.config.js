var path = require('path');

module.exports = {
    entry: [
        './public/javascripts/views/hello/hello.entry.js'
        // ,
        // './public/javascripts/views/photo/photo.entry.js'
    ],
    output: {
        path: path.join(__dirname, '/dist'),
        //filename: '[chunkhash].bundle.js'
        filename: '[name].bundle.js'
    },
    resolve: {
        root: path.resolve(__dirname),
        alias:{
            views: './public/javascripts/views',
            comps: path.join(__dirname, 'public/react_components')
        },
        extensions: ['', '.js', '.jsx']
    },
    module:{
        loaders: [
            {
                test: /\.js|jsx$/,
                loaders: ['babel']
            }
        ]
    }
};