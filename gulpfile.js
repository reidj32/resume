'use strict';

var gulp = require('gulp');
var del = require('del');
var uglifycss = require('gulp-uglifycss');
var htmlmin = require('gulp-htmlmin');
var sequence = require('gulp-sequence');
var zip = require('gulp-zip');
var webserver = require('gulp-webserver');
var exec = require('child_process').exec;

/**
 * Cleans and builds the entire project
 */
gulp.task('default', sequence('clean', 'build'));

/**
 * Cleans the project output files
 */
gulp.task('clean', ['clean-welcome', 'clean-html5', 'clean-angular'], function() {
    del.sync(['./dist']);
  }
);

/**
 * Builds all projects and places them in the dist/ directory
 */
gulp.task('build', ['build-welcome', 'build-html5', 'build-angular'], function() {
    gulp.src('./src/welcome/dist/**/*')
        .pipe(gulp.dest('./dist/'));

    gulp.src('./src/html5/dist/**/*')
        .pipe(gulp.dest('./dist/resumes/html5/'));

    gulp.src('./src/angular/dist/**/*')
        .pipe(gulp.dest('./dist/resumes/angular/'));
  }
);

/**
 * After building all projects, zips up the dist/ folder for deployment
 */
gulp.task('bundle', ['build'], function() {
  gulp.src('./dist/**/*')
      .pipe(zip('bundle.zip'))
      .pipe(gulp.dest('./dist/'));
});

/**
 * Builds the welcome project
 */
gulp.task('build-welcome', function() {
  gulp.src('./src/welcome/src/**/*.html')
      .pipe(htmlmin({
          collapseWhitespace: true,
          removeComments: true
      }))
      .pipe(gulp.dest('./src/welcome/dist/'));

  gulp.src('./src/welcome/src/**/*.css')
      .pipe(uglifycss())
      .pipe(gulp.dest('./src/welcome/dist/'));

  gulp.src(['./src/welcome/src/**/*.?(png|jpg|ico)'])
      .pipe(gulp.dest('./src/welcome/dist/'));
});

/**
 * Cleans the welcome project
 */
gulp.task('clean-welcome', function() {
  del.sync(['./src/welcome/dist']);
});

/**
 * Builds the HTML5 project
 */
gulp.task('build-html5', function() {
  gulp.src('./src/html5/src/**/*.html')
      .pipe(htmlmin({
          collapseWhitespace: true,
          removeComments: true
      }))
      .pipe(gulp.dest('./src/html5/dist/'));

  gulp.src('./src/html5/src/**/*.css')
      .pipe(uglifycss())
      .pipe(gulp.dest('./src/html5/dist/'));
});

/**
 * Cleans the HTML5 project
 */
gulp.task('clean-html5', function() {
  del.sync(['./src/html5/dist']);
});

/**
 * Builds the Angular project
 */
gulp.task('build-angular', function(cb) {
  exec('ng build --base-href /resumes/angular/ --deploy-url /resumes/angular/', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

/**
 * Cleans the Angular project
 */
gulp.task('clean-angular', function() {
  del.sync(['./src/angular/dist']);
});

/**
 * Builds and runs all projects in a local webserver
 */
gulp.task('run', ['build'], function() {
  gulp.src('./dist')
    .pipe(webserver({
      open: true,
      fallback: 'index.html'
    }));
});

/**
 * Runs the welcome project in a local webserver
 */
gulp.task('run-welcome', ['build-welcome'], function() {
  gulp.src('./src/welcome/dist')
      .pipe(webserver({
        open: true,
        fallback: 'index.html'
      }));
});

/**
 * Runs the HTML5 project in a local webserver
 */
gulp.task('run-html5', ['build-html5'], function() {
  gulp.src('./src/html5/dist')
      .pipe(webserver({
        open: true,
        fallback: 'index.html'
      }));
});

/**
 * Runs the Angular project in a local webserver
 */
gulp.task('run-ng', function() {
  exec('ng serve', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});
