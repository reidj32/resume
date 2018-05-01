'use strict';

var gulp = require('gulp');
var del = require('del');
var uglifycss = require('gulp-uglifycss');
var htmlmin = require('gulp-htmlmin');
var sequence = require('gulp-sequence');
var zip = require('gulp-zip');

gulp.task('default', sequence('clean', 'build'));

gulp.task('clean', function() {
  del.sync(['./dist', './dist.zip']);
});

gulp.task('build', sequence('build-wwwroot', ['build-html5', 'build-angular']));

gulp.task('zip', ['build'], function() {
  gulp
    .src('./dist/**/*')
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('.'));
});

gulp.task('build-wwwroot', function() {
  gulp
    .src('./wwwroot/**/*.html')
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(gulp.dest('./dist/'));

  gulp
    .src('./wwwroot/**/*.css')
    .pipe(uglifycss())
    .pipe(gulp.dest('./dist/'));

  gulp
    .src(['./wwwroot/**/*.png', './wwwroot/**/*.jpg', './wwwroot/**/*.ico'])
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build-html5', function() {
  gulp
    .src('./html5/**/*.html')
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(gulp.dest('./dist/resumes/html5/'));

  gulp
    .src('./html5/**/*.css')
    .pipe(uglifycss())
    .pipe(gulp.dest('./dist/resumes/html5/'));
});

gulp.task('build-angular', function() {
  gulp
    .src(
      [
        './angular/dist/*.html',
        './angular/dist/*.js',
        './angular/dist/*.css',
        './angular/dist/*.txt'
      ],
      { allowEmpty: true }
    )
    .pipe(gulp.dest('./dist/resumes/angular/'));
});
