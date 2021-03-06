/**
 * Created by damon on 14/11/2016.
 */
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    webpack = require('webpack'),
    livereload = require('gulp-livereload');

var paths = {
    scripts: [''],
    images: 'k'
};

var webpackConfig = require('./webpack.config.js');



gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('clean', function(){
  return del(['build']);
});

gulp.task('ems', function () {
    livereload.listen({
        port: 35729
    });
    gulp.watch([
        'views/lab/canvas.pug',
        'public/javascripts/lab/canvas.js',
        'public/stylesheets/canvas.css'
    ], function (event) {
        gulp.src(event.path).pipe(livereload());
    });
    gulp.watch([
        'public/react_components/*.jsx',
        'public/stylesheets/*.scss'
    ], function (event) {
        webpack(webpackConfig).run(function (done) {
            gulp.src(event.path).pipe(livereload());
        });
    });
});
