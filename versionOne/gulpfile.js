"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");

gulp.task("watch", () => {
   gulp.watch("src/sass/**/*.scss", ["sass"])
})

gulp.task("sass", () => {
  gulp.src("src/sass/**/*.scss")
  .pipe(sass())
      .pipe(autoprefixer())
    .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('dist/css/'));
});
