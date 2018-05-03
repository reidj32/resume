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
var cdnizer = require('gulp-cdnizer');
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
  delay: 10
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
  ],
  min: {
    css: [
      './node_modules/bootstrap/dist/css/bootstrap.min.css'
    ],
    js: [
      './node_modules/jquery/dist/jquery.slim.min.js',
      './node_modules/popper.js/dist/popper.min.js',
      './node_modules/bootstrap/dist/js/bootstrap.min.js',
    ]
  },
  cdn: [
    {
      file: 'css/bootstrap?(.min).css',
      package: 'bootstrap',
      cdn: 'https://stackpath.bootstrapcdn.com/bootstrap/${version}/css/bootstrap.min.css'
    },
    {
      file: 'js/jquery.slim?(.min).js',
      package: 'jquery',
      cdn: 'https://code.jquery.com/jquery-${version}.slim.min.js'
    },
    {
      file: 'js/popper?(.min).js',
      package: 'popper.js',
      cdn: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/${version}/umd/popper.min.js'
    },
    {
      file: 'js/bootstrap?(.min).js',
      package: 'bootstrap',
      cdn: 'https://stackpath.bootstrapcdn.com/bootstrap/${version}/js/bootstrap.min.js'
    }
  ]
};

var fontawesome = {
  js: [
    './lib/fontawesome/fontawesome-all.js'
  ],
  min: {
    js: [
      './lib/fontawesome/fontawesome-all.min.js'
    ]
  },
  cdn: [
    {
      file: 'js/fontawesome-all?(.min).js',
      cdn: 'https://use.fontawesome.com/releases/v5.0.10/js/all.js'
    }
  ]
};

var anchor = {
  js: [
    './node_modules/anchor-js/anchor.js'
  ],
  min: {
    js: [
      './node_modules/anchor-js/anchor.min.js'
    ]
  },
  cdn: [
    {
      file: 'js/anchor?(.min).js',
      package: 'anchor-js',
      cdn: 'https://cdnjs.cloudflare.com/ajax/libs/anchor-js/${version}/anchor.min.js'
    }
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
  var cdn = [];
  cdn = cdn.concat(bootstrap.cdn);
  cdn = cdn.concat(fontawesome.cdn);

  return gulp.src('./src/welcome/src/**/*.html')
    .pipe(gulpif(config.production(),
      inject(gulp.src([
        './src/welcome/dist/**/jquery.slim.min.js',
        './src/welcome/dist/**/popper.min.js',
        './src/welcome/dist/**/bootstrap.min.?(js|css)',
        './src/welcome/dist/**/fontawesome-all.min.js',
        './src/welcome/dist/**/site?(.min).css'
      ], { read: false }), injectOpts),
      inject(gulp.src([
        './src/welcome/dist/**/jquery.slim.js?(.map)',
        './src/welcome/dist/**/popper.js?(.map)',
        './src/welcome/dist/**/bootstrap.?(js|css)?(.map)',
        './src/welcome/dist/**/fontawesome-all.js',
        './src/welcome/dist/**/site?(.min).css'
      ], { read: false }), injectOpts)
    ))
    .pipe(gulpif(config.production(), cdnizer(cdn)))
    .pipe(gulpif(config.production(), htmlmin(htmlminOpts)))
    .pipe(gulp.dest('./src/welcome/dist/'));
});

/**
 * Copies the Welcome project dependencies to the output folder
 */
gulp.task('build:welcome:deps', function() {
  var streams = [];

  if (config.production()) {
    streams.push(gulp.src(bootstrap.min.js)
      .pipe(gulp.dest('./src/welcome/dist/js/')));

    streams.push(gulp.src(bootstrap.min.css)
      .pipe(gulp.dest('./src/welcome/dist/css/')));

    streams.push(gulp.src(fontawesome.min.js)
      .pipe(gulp.dest('./src/welcome/dist/js/')));
  } else {
    streams.push(gulp.src(bootstrap.js)
      .pipe(gulp.dest('./src/welcome/dist/js/')));

    streams.push(gulp.src(bootstrap.css)
      .pipe(gulp.dest('./src/welcome/dist/css/')));

    streams.push(gulp.src(fontawesome.js)
      .pipe(gulp.dest('./src/welcome/dist/js/')));
  }

  streams.push(gulp.src('./src/welcome/src/**/*.css')
    .pipe(gulpif(config.production(), uglifycss()))
    .pipe(gulpif(config.production(), rename({ extname: '.min.css' })))
    .pipe(gulp.dest('./src/welcome/dist/')));

  streams.push(gulp.src(['./src/welcome/src/**/*.?(png|jpg|ico)'])
    .pipe(gulp.dest('./src/welcome/dist/')));

  return merge(streams);
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
  var cdn = [];
  cdn = cdn.concat(bootstrap.cdn);
  cdn = cdn.concat(fontawesome.cdn);
  cdn = cdn.concat(anchor.cdn);

  return gulp.src('./src/minimal/src/**/*.html')
    .pipe(gulpif(config.production(),
      inject(gulp.src([
        './src/minimal/dist/**/jquery.slim.min.js',
        './src/minimal/dist/**/popper.min.js',
        './src/minimal/dist/**/bootstrap.min.?(js|css)',
        './src/minimal/dist/**/fontawesome-all.min.js',
        './src/minimal/dist/**/anchor.min.js',
        './src/minimal/dist/**/site?(.min).css'
      ], { read: false }), injectOpts),
      inject(gulp.src([
        './src/minimal/dist/**/jquery.slim.js?(.map)',
        './src/minimal/dist/**/popper.js?(.map)',
        './src/minimal/dist/**/bootstrap.?(js|css)?(.map)',
        './src/minimal/dist/**/fontawesome-all.js',
        './src/minimal/dist/**/anchor.js?(.map)',
        './src/minimal/dist/**/site?(.min).css'
      ], { read: false }), injectOpts)
    ))
    .pipe(gulpif(config.production(), cdnizer(cdn)))
    .pipe(gulpif(config.production(), htmlmin(htmlminOpts)))
    .pipe(gulp.dest('./src/minimal/dist/'));
});

/**
 * Copies the Minimal project dependencies to the output folder
 */
gulp.task('build:minimal:deps', function() {
  var streams = [];

  if (config.production()){
    streams.push(gulp.src(bootstrap.min.js)
      .pipe(gulp.dest('./src/minimal/dist/js/')));

    streams.push(gulp.src(bootstrap.min.css)
      .pipe(gulp.dest('./src/minimal/dist/css/')));

    streams.push(gulp.src(anchor.min.js)
      .pipe( gulp.dest('./src/minimal/dist/js/')));

    streams.push(gulp.src(fontawesome.min.js)
      .pipe(gulp.dest('./src/minimal/dist/js/')));
  } else {
    streams.push(gulp.src(bootstrap.js)
      .pipe(gulp.dest('./src/minimal/dist/js/')));

    streams.push(gulp.src(bootstrap.css)
      .pipe(gulp.dest('./src/minimal/dist/css/')));

    streams.push(gulp.src(anchor.js)
      .pipe(gulp.dest('./src/minimal/dist/js/')));

    streams.push(gulp.src(fontawesome.js)
      .pipe(gulp.dest('./src/minimal/dist/js/')));
  }

  streams.push(gulp.src('./src/minimal/src/**/*.css')
    .pipe(gulpif(config.production(), uglifycss()))
    .pipe(gulpif(config.production(), rename({ extname: '.min.css' })))
    .pipe(gulp.dest('./src/minimal/dist/')));

  return merge(streams);
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
gulp.task('build:angular', function(done) {
  if (config.development()) {
    child_process.exec('ng build --base-href /resumes/angular/ --deploy-url /resumes/angular/', function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      done(err);
    });
  } else if (config.production()) {
    child_process.exec('ng build --prod --base-href /resumes/angular/ --deploy-url /resumes/angular/', function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      done(err);
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
});

/**
 * Runs the Welcome project in a local webserver
 */
gulp.task('run:welcome', ['build:welcome'], function(done) {
  gulp.src('./src/welcome/dist').pipe(webserver(webserverOpts));
  gulp.watch('./src/welcome/src/**/*', watchOpts, ['build:welcome']);
  done();
});

/**
 * Runs the Minimal project in a local webserver
 */
gulp.task('run:minimal', ['build:minimal'], function(done) {
  gulp.src('./src/minimal/dist').pipe(webserver(webserverOpts));
  gulp.watch('./src/minimal/src/**/*', watchOpts, ['build:minimal']);
  done();
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
