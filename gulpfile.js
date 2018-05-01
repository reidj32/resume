'use strict';

var gulp = require('gulp');
var del = require('del');
var uglifycss = require('gulp-uglifycss');
var htmlmin = require('gulp-htmlmin');
var sequence = require('gulp-sequence');
var zip = require('gulp-zip');
var exec = require('child_process').exec;

gulp.task('default', sequence('clean', 'build'));

gulp.task('clean', function() {
  del.sync(['./dist']);
});

gulp.task('build', sequence('build-wwwroot', ['build-html5', 'build-angular']));

gulp.task('zip', ['build'], function() {
  gulp
    .src('./dist/**/*')
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./dist/'));
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

gulp.task('build-angular', function(cb) {
  exec(
    'ng build --prod --base-href /resumes/angular/ --deploy-url /resumes/angular/',
    function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    }
  );
});
