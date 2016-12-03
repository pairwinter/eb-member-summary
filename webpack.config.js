var path = require('path');

module.exports = {
    entry: [
        // './public/javascripts/views/hello/hello.entry.js',
        './public/javascripts/views/photo/photo.entry.js'
    ],
    output: {
        path: path.join(__dirname, '/dist'),
        //filename: '[chunkhash].bundle.js'
        filename: '[name].bundle.js',
        // publicPath: '/dist/'
    },
    resolve: {
        root: path.resolve(__dirname),
        alias:{
            views: './public/javascripts/views',
            comps: path.join(__dirname, 'public/react_components'),
            css: path.join(__dirname, 'public/stylesheets'),
        },
        extensions: ['', '.js', '.jsx']
    },
    module:{
        loaders: [
            {
                test: /\.js|jsx$/,
                loaders: ['babel']
            },
            {
                test: /\.scss$/,
                // loaders: ["style-loader", "raw-loader", "sass-loader"]
                // loaders: ["style-loader/url", "file-loader?name=[name].css", "sass-loader"]
                loaders: ["file-loader?name=[name].css", "sass-loader"]
            }
        ]
    },
    sassLoader: {
        includePaths: [path.resolve(__dirname, "./public/stylesheets")]
    }
};