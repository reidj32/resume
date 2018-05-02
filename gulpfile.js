'use strict';

var gulp = require('gulp');
var del = require('del');
var uglifycss = require('gulp-uglifycss');
var htmlmin = require('gulp-htmlmin');
var sequence = require('gulp-sequence');
var zip = require('gulp-zip');
var webserver = require('gulp-webserver');
var gulpif = require('gulp-if');
var child_process = require('child_process');
var yargs = require('yargs');

var config = {
  environment: yargs.argv.env || 'development',
  development() {
    return this.environment === 'development' || this.environment === 'dev';
  },
  production() {
    return this.environment === 'production' || this.environment === 'prod';
  }
};

var webserverOpts = {
  open: true,
  livereload: true,
  fallback: 'index.html'
};

var htmlminOpts = {
  collapseWhitespace: true,
  removeComments: true
};

var watchOpts = {
  delay: 100
};

/**
 * Cleans and builds the entire project
 */
gulp.task('default', ['build']);

/**
 * After building all projects, zips up the dist/ folder for deployment
 */
gulp.task('bundle', ['package'], function() {
  return gulp.src('./dist/**/*')
    .pipe(zip('bundle.zip'))
    .pipe(gulp.dest('./dist/'));
});

/**
 * Builds all projects
 */
gulp.task('build', sequence('clean', ['build:welcome', 'build:html5', 'build:angular']));

/**
 * Packages all files and place them in the ./dist/ directory
 */
gulp.task('package', sequence('clean', ['package:welcome', 'package:html5', 'package:angular']));

/**
* Cleans the project output files
*/
gulp.task('clean', ['clean:welcome', 'clean:html5', 'clean:angular'], function() {
   del.sync(['./dist']);
});

/**
 * Builds the Welcome project
 */
gulp.task('build:welcome', ['build:welcome:html', 'build:welcome:styles', 'build:welcome:assets']);

/**
 * Minify the Welcome html files.
 */
gulp.task('build:welcome:html', function() {
  return gulp.src('./src/welcome/src/**/*.html')
    .pipe(gulpif(config.production(), htmlmin(htmlminOpts)))
    .pipe(gulp.dest('./src/welcome/dist/'));
});

/**
 * Minify the Welcome css files.
 */
gulp.task('build:welcome:styles', function() {
  return gulp.src('./src/welcome/src/**/*.css')
    .pipe(gulpif(config.production(), uglifycss()))
    .pipe(gulp.dest('./src/welcome/dist/'));
});

/**
 * Copy the Welcome asset files.
 */
gulp.task('build:welcome:assets', function() {
  return gulp.src(['./src/welcome/src/**/*.?(png|jpg|ico)'])
    .pipe(gulp.dest('./src/welcome/dist/'));
});

/**
 * Packages the Welcome build
 */
gulp.task('package:welcome', ['build:welcome'], function() {
  return gulp.src('./src/welcome/dist/**/*')
    .pipe(gulp.dest('./dist/'));
});

/**
 * Cleans the Welcome project
 */
gulp.task('clean:welcome', function() {
  del.sync(['./src/welcome/dist']);
});

/**
 * Builds the HTML5 project
 */
gulp.task('build:html5', ['build:html5:html', 'build:html5:styles']);

/**
 * Minify the HTML5 project html files
 */
gulp.task('build:html5:html', function() {
  return gulp.src('./src/html5/src/**/*.html')
    .pipe(gulpif(config.production(), htmlmin(htmlminOpts)))
    .pipe(gulp.dest('./src/html5/dist/'));
});

/**
 * Minify the HTML5 project css files
 */
gulp.task('build:html5:styles', function() {
  return gulp.src('./src/html5/src/**/*.css')
    .pipe(gulpif(config.production(), uglifycss()))
    .pipe(gulp.dest('./src/html5/dist/'));
});

/**
 * Packages the HTML5 build
 */
gulp.task('package:html5', ['build:html5'], function() {
  return gulp.src('./src/html5/dist/**/*')
    .pipe(gulp.dest('./dist/resumes/html5/'));
});

/**
 * Cleans the HTML5 project
 */
gulp.task('clean:html5', function() {
  del.sync(['./src/html5/dist']);
});

/**
 * Builds the Angular project
 */
gulp.task('build:angular', function(cb) {
  if (config.development()) {
    child_process.exec('ng build --base-href /resumes/angular/ --deploy-url /resumes/angular/', function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  } else if (config.production()) {
    child_process.exec('ng build --prod --base-href /resumes/angular/ --deploy-url /resumes/angular/', function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  }
});

/**
 * Packages the Angular build
 */
gulp.task('package:angular', ['build:angular'], function() {
  return gulp.src('./src/angular/dist/**/*')
    .pipe(gulp.dest('./dist/resumes/angular/'));
});

/**
 * Cleans the Angular project
 */
gulp.task('clean:angular', function() {
  del.sync(['./src/angular/dist']);
});

/**
 * Builds and runs all projects in a local webserver
 */
gulp.task('run', ['build'], function() {
  return gulp.src('./dist')
    .pipe(webserver(webserverOpts))
    .pipe(gulp.watch('./src/?(welcome|html5|angular)/src/**/*', watchOpts, ['build']));
});

/**
 * Runs the welcome project in a local webserver
 */
gulp.task('run:welcome', ['build:welcome'], function() {
  return gulp.src('./src/welcome/dist')
    .pipe(webserver(webserverOpts))
    .pipe(gulp.watch('./src/welcome/src/**/*', watchOpts, ['build:welcome']));
});

/**
 * Runs the HTML5 project in a local webserver
 */
gulp.task('run:html5', ['build:html5'], function() {
  return gulp.src('./src/html5/dist')
    .pipe(webserver(webserverOpts))
    .pipe(gulp.watch('./src/html5/src/**/*', watchOpts, ['build:html5']));
});

/**
 * Runs the Angular project in a local webserver
 */
gulp.task('run:angular', function() {
  child_process.execSync('ng serve --open', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});
