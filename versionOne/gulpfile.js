"use strict";

const gulp         = require("gulp");
const sass         = require("gulp-sass");
const autoprefixer = require('autoprefixer');
const postcss      = require('gulp-postcss');
const cssnano      = require('cssnano');

//Watch scr sass directory files for changes Run style function if changes are found
     function watch(){
       gulp.watch('src/sass/**/*.scss', style, autoprefixer)
    }

    function style(){
        return gulp.src("src/sass/**/*.scss")
            // Use sass with the files found, and log any errors
            .pipe(sass()).on('error', sass.logError)
            .pipe(gulp.dest('dist/css/'))
    }

    gulp.task('autoprefixer', function () {
    var postcss      = require('gulp-postcss');
    var sourcemaps   = require('gulp-sourcemaps');
    var autoprefixer = require('autoprefixer');
    var cssnano      = require('cssnano');

    return gulp.src('dist/css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer({browsers: ['last 2 version']}), cssnano()  ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css/'));
});

   // exports.style = style;
    exports.watch = watch
