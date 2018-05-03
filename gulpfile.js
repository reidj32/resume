'use strict';

var gulp = require('gulp');
var merge = require('merge-stream');
var del = require('del');
var uglifycss = require('gulp-uglifycss');
var htmlmin = require('gulp-htmlmin');
var sequence = require('gulp-sequence');
var zip = require('gulp-zip');
var webserver = require('gulp-webserver');
var gulpif = require('gulp-if');
var inject = require('gulp-inject');
var rename = require('gulp-rename');
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

var injectOpts = {
  relative: true,
  ignorePath: ['../dist/']
};

var bootstrap = {
  css: [
    './node_modules/bootstrap/dist/css/bootstrap.css',
    './node_modules/bootstrap/dist/css/bootstrap.css.map'
  ],
  js: [
    './node_modules/jquery/dist/jquery.slim.js',
    './node_modules/popper.js/dist/popper.js',
    './node_modules/popper.js/dist/popper.js.map',
    './node_modules/bootstrap/dist/js/bootstrap.js',
    './node_modules/bootstrap/dist/js/bootstrap.js.map'
  ]
};

var fontawesome = {
  js: [
    './lib/fontawesome/fontawesome-all.js'
  ]
};

var anchor = {
  js: [
    './node_modules/anchor-js/anchor.js'
  ]
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
gulp.task('build', sequence('clean', ['build:welcome', 'build:minimal', 'build:angular']));

/**
 * Packages all files and place them in the ./dist/ directory
 */
gulp.task('package', sequence('clean', ['package:welcome', 'package:minimal', 'package:angular']));

/**
* Cleans the project output files
*/
gulp.task('clean', ['clean:welcome', 'clean:minimal', 'clean:angular'], function() {
   del.sync(['./dist']);
});

/**
 * Builds the Welcome project
 */
gulp.task('build:welcome', ['build:welcome:deps'], function() {
  return gulp.src('./src/welcome/src/**/*.html')
    .pipe(gulpif(config.development(),
      inject(gulp.src([
        './src/welcome/dist/**/jquery*.js?(.map)',
        './src/welcome/dist/**/popper*.js?(.map)',
        './src/welcome/dist/**/bootstrap*.?(js|css)?(.map)',
        './src/welcome/dist/**/fontawesome*.?(js|css)',
      ], { read: false }), injectOpts)
    ))
    .pipe(inject(gulp.src([
      './src/welcome/dist/**/site?(.min).css'
    ], { read: false }), injectOpts))
    .pipe(gulpif(config.production(), htmlmin(htmlminOpts)))
    .pipe(gulp.dest('./src/welcome/dist/'));
});

/**
 * Copies the Welcome project dependencies to the output folder
 */
gulp.task('build:welcome:deps', function() {
  var bsJsStream = gulp.src(bootstrap.js)
    .pipe(gulpif(config.development(), gulp.dest('./src/welcome/dist/js/')));

  var bsCssStream = gulp.src(bootstrap.css)
    .pipe(gulpif(config.development(), gulp.dest('./src/welcome/dist/css/')));

  var faJsStream = gulp.src(fontawesome.js)
    .pipe(gulpif(config.development(), gulp.dest('./src/welcome/dist/js/')));

  var cssStream = gulp.src('./src/welcome/src/**/*.css')
    .pipe(gulpif(config.production(), uglifycss()))
    .pipe(gulpif(config.production(), rename({ extname: '.min.css' })))
    .pipe(gulp.dest('./src/welcome/dist/'));

  var assetsStream = gulp.src(['./src/welcome/src/**/*.?(png|jpg|ico)'])
    .pipe(gulp.dest('./src/welcome/dist/'));

  return merge([bsJsStream, bsCssStream, faJsStream, cssStream, assetsStream]);
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
 * Builds the Minimal project
 */
gulp.task('build:minimal', ['build:minimal:deps'], function() {
  return gulp.src('./src/minimal/src/**/*.html')
    .pipe(gulpif(config.development(),
      inject(gulp.src([
        './src/minimal/dist/**/jquery*.js?(.map)',
        './src/minimal/dist/**/popper*.js?(.map)',
        './src/minimal/dist/**/bootstrap*.?(js|css)?(.map)',
        './src/minimal/dist/**/fontawesome*.?(js|css)',
        './src/minimal/dist/**/anchor*.js?(.map)'
      ], { read: false }), injectOpts)
    ))
    .pipe(inject(gulp.src([
        './src/minimal/dist/**/site?(.min).css'
    ], { read: false }), injectOpts))
    .pipe(gulpif(config.production(), htmlmin(htmlminOpts)))
    .pipe(gulp.dest('./src/minimal/dist/'));
});

/**
 * Copies the Minimal project dependencies to the output folder
 */
gulp.task('build:minimal:deps', function() {
  var bsJsStream = gulp.src(bootstrap.js)
    .pipe(gulpif(config.development(), gulp.dest('./src/minimal/dist/js/')));

  var bsCssStream = gulp.src(bootstrap.css)
    .pipe(gulpif(config.development(), gulp.dest('./src/minimal/dist/css/')));

  var anchorJsStream = gulp.src(anchor.js)
    .pipe(gulpif(config.development(), gulp.dest('./src/minimal/dist/js/')));

  var faJsStream = gulp.src(fontawesome.js)
    .pipe(gulpif(config.development(), gulp.dest('./src/minimal/dist/js/')));

  var cssStream = gulp.src('./src/minimal/src/**/*.css')
    .pipe(gulpif(config.production(), uglifycss()))
    .pipe(gulpif(config.production(), rename({ extname: '.min.css' })))
    .pipe(gulp.dest('./src/minimal/dist/'));

  return merge([bsJsStream, bsCssStream, anchorJsStream, cssStream]);
});

/**
 * Packages the Minimal build
 */
gulp.task('package:minimal', ['build:minimal'], function() {
  return gulp.src('./src/minimal/dist/**/*')
    .pipe(gulp.dest('./dist/resumes/minimal/'));
});

/**
 * Cleans the Minimal project
 */
gulp.task('clean:minimal', function() {
  del.sync(['./src/minimal/dist']);
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
gulp.task('run', ['package'], function() {
  return gulp.src('./dist')
    .pipe(webserver(webserverOpts))
    .pipe(gulp.watch('./src/?(welcome|minimal|angular)/src/**/*', watchOpts, ['build']));
});

/**
 * Runs the Welcome project in a local webserver
 */
gulp.task('run:welcome', ['build:welcome'], function() {
  return gulp.src('./src/welcome/dist')
    .pipe(webserver(webserverOpts))
    .pipe(gulp.watch('./src/welcome/src/**/*', watchOpts, ['build:welcome']));
});

/**
 * Runs the Minimal project in a local webserver
 */
gulp.task('run:minimal', ['build:minimal'], function() {
  return gulp.src('./src/minimal/dist')
    .pipe(webserver(webserverOpts))
    .pipe(gulp.watch('./src/minimal/src/**/*', watchOpts, ['build:minimal']));
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
