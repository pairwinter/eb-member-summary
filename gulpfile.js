/**
 * Created by damon on 14/11/2016.
 */
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del');

var paths = {
    scripts: [''],
    images: 'k'
};



gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('clean', function(){
  return del(['build']);
});
