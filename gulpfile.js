/**
 * Created by admin on 8/16/2016.
 */
var gulp = require('gulp'),
    bower = require('gulp-bower');
var minify = require('gulp-minify');
var concat = require('gulp-concat');

gulp.task('compress', function () {
    gulp.src('public/view/**/*.js')
        .pipe(concat('all.js'))
        .pipe(minify({
            ext: {
                src: '-debug.js',
                min: '.js'
            },
            exclude: ['tasks'],
            ignoreFiles: []
        }))
        .pipe(gulp.dest('public/javascripts/'))
});
gulp.task('default', ['compress']);
