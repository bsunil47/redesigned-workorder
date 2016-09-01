/**
 * Created by admin on 8/16/2016.
 */
var gulp = require('gulp'),
    bower = require('gulp-bower');
var minify = require('gulp-minify');
var concat = require('gulp-concat');
var gls = require('gulp-live-server');
var install = require("gulp-install");
gulp.task('npm', function () {
    gulp.src(['./bower.json', './package.json'])
        .pipe(install());
});
gulp.task('compress', function () {
    gulp.src('public/view/**/*.js')
        .pipe(concat('allCtrls.js'))
        .pipe(minify({
            ext: {
                src: '.js',
                min: '-min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: []
        }))
        .pipe(gulp.dest('public/javascripts/'))
});
gulp.task('serve', function () {
    //1. run your script as a server
    //var server = gls.new('bin/www');
    //server.start();

    //2. run script with cwd args, e.g. the harmony flag
    var server = gls.new(['--harmony', 'bin/www']);
    //this will achieve `node --harmony myapp.js`
    //you can access cwd args in `myapp.js` via `process.argv`
    server.start();

    //use gulp.watch to trigger server actions(notify, start or stop)
    gulp.watch(['public/**/*.css', 'public/**/*.html', 'public/**/*.scss', 'routes/*.js', 'views/*.ejs'], function (file) {
        server.notify.apply(server, [file]);
    });
    gulp.watch('bin/www', server.start.bind(server)); //restart my server

    // Note: try wrapping in a function if getting an error like `TypeError: Bad argument at TypeError (native) at ChildProcess.spawn`
    gulp.watch('bin/www', function () {
        server.start.bind(server)()
    });
});
gulp.task('default', ['npm', 'compress', 'serve']);
