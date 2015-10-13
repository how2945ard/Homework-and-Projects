var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    nodemon = require('gulp-nodemon'),
    watch = require('gulp-watch');

gulp.task('css', function() {
    gulp.src('public/css/*.css')
        .pipe(watch())
        .pipe(livereload());
});

gulp.task('js', function() {
    gulp.src('public/js/**/*.js')
        .pipe(watch())
        .pipe(livereload());
});


gulp.task('ejs', function() {
    gulp.src('views/**/*.ejs')
        .pipe(watch())
        .pipe(livereload());
});



gulp.task('develop', function() {

    // not a good way but gulp-nodemon sucks xD
    nodemon({
        script: 'develop.js',
        ext: 'js json'
    });

    // nodemon.on('start', function() {
    //     console.log('App has started');
    // }).on('quit', function() {
    //     console.log('App has quit');
    // }).on('restart', function(files) {
    //     console.log('App restarted due to: ', files);
    // });

});

gulp.task('default', ['develop', 'css', 'ejs', 'js']);