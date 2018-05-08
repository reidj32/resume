'use strict';

var gulp = require('gulp');
var del = require('del');
var delete_empty = require('delete-empty');
var yargs = require('yargs');
var merge = require('merge-stream');
var child_process = require('child_process');
var uglify = require('gulp-uglify');
var minify = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var jsonminify = require('gulp-jsonminify');
var sequence = require('gulp-sequence');
var zip = require('gulp-zip');
var webserver = require('gulp-webserver');
var gulpif = require('gulp-if');
var inject = require('gulp-inject');
var rename = require('gulp-rename');
var cdnizer = require('gulp-cdnizer');

var config = {
  environment: yargs.argv.env || 'development',
  development() {
    return this.environment === 'development' || this.environment === 'dev';
  },
  production() {
    return this.environment === 'production' || this.environment === 'prod';
  }
};

var faviconArray = [
  './assets/icons/apple-touch-icon-precomposed.png',
  './assets/icons/favicon.png',
  './assets/icons/favicon.ico'
];

var webserverOpts = {
  open: true,
  livereload: true
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
  ignorePath: ['../build/']
};

var bootstrap = {
  css: [
    './node_modules/bootstrap/dist/css/bootstrap.css',
    './node_modules/bootstrap/dist/css/bootstrap.css.map'
  ],
  js: [
    './node_modules/jquery/dist/jquery.js',
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
      './node_modules/jquery/dist/jquery.min.js',
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
      file: 'js/jquery?(.min).js',
      package: 'jquery',
      cdn: 'https://code.jquery.com/jquery-${version}.min.js'
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
gulp.task('package', sequence('clean', ['package:assets', 'package:welcome', 'package:minimal', 'package:angular']));

/**
 * Package the asset files in the ./dist/ directory
 */
gulp.task('package:assets', function() {
  var streams = [];

  streams.push(gulp.src('./assets/fonts/*!(.css)')
    .pipe(gulp.dest('./dist/fonts/')));

  streams.push(gulp.src('./assets/fonts/*.css')
    .pipe(gulpif(config.production(), minify()))
    .pipe(gulp.dest('./dist/fonts/')));

  streams.push(gulp.src('./assets/i18n/*.json')
    .pipe(gulpif(config.production(), jsonminify()))
    .pipe(gulp.dest('./dist/i18n/')));

  streams.push(gulp.src('./assets/icons/*.svg')
    .pipe(gulp.dest('./dist/icons/')));

  return merge(streams);
});

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
        './src/welcome/build/**/jquery.min.js',
        './src/welcome/build/**/popper.min.js',
        './src/welcome/build/**/bootstrap.min.?(js|css)',
        './src/welcome/build/**/fontawesome-all.min.js',
        './src/welcome/build/**/site?(.min).?(js|css)'
      ], { read: false }), injectOpts),
      inject(gulp.src([
        './src/welcome/build/**/jquery.js?(.map)',
        './src/welcome/build/**/popper.js?(.map)',
        './src/welcome/build/**/bootstrap.?(js|css)?(.map)',
        './src/welcome/build/**/fontawesome-all.js',
        './src/welcome/build/**/site?(.min).?(js|css)'
      ], { read: false }), injectOpts)
    ))
    .pipe(gulpif(config.production(), cdnizer(cdn)))
    .pipe(gulpif(config.production(), htmlmin(htmlminOpts)))
    .pipe(gulp.dest('./src/welcome/build/'));
});

/**
 * Copies the Welcome project dependencies to the output folder
 */
gulp.task('build:welcome:deps', ['clean:welcome'], function() {
  var streams = [];

  if (config.production()) {
    streams.push(gulp.src(bootstrap.min.js)
      .pipe(gulp.dest('./src/welcome/build/js/')));

    streams.push(gulp.src(bootstrap.min.css)
      .pipe(gulp.dest('./src/welcome/build/css/')));

    streams.push(gulp.src(fontawesome.min.js)
      .pipe(gulp.dest('./src/welcome/build/js/')));
  } else {
    streams.push(gulp.src(bootstrap.js)
      .pipe(gulp.dest('./src/welcome/build/js/')));

    streams.push(gulp.src(bootstrap.css)
      .pipe(gulp.dest('./src/welcome/build/css/')));

    streams.push(gulp.src(fontawesome.js)
      .pipe(gulp.dest('./src/welcome/build/js/')));

    streams.push(gulp.src(faviconArray)
      .pipe(gulp.dest('./src/welcome/build/')));
  }

  streams.push(gulp.src('./src/welcome/src/**/*.css')
    .pipe(gulpif(config.production(), minify()))
    .pipe(gulpif(config.production(), rename({ extname: '.min.css' })))
    .pipe(gulp.dest('./src/welcome/build/')));

  streams.push(gulp.src('./src/welcome/src/**/*.js')
    .pipe(gulpif(config.production(), uglify()))
    .pipe(gulpif(config.production(), rename({ extname: '.min.js' })))
    .pipe(gulp.dest('./src/welcome/build/')));

  streams.push(gulp.src(['./src/welcome/src/**/*.?(png|jpg|ico)'])
    .pipe(gulp.dest('./src/welcome/build/')));

  return merge(streams);
});

/**
 * Packages the Welcome build
 */
gulp.task('package:welcome', ['build:welcome'], function() {
  var streams = [];

  if (config.production()) {
    del.sync([
      './src/welcome/build/css/!(site)*.min.css',
      './src/welcome/build/js/!(site)*.min.js'
    ]);

    delete_empty.sync('./src/welcome/build/');

    streams.push(gulp.src(faviconArray)
      .pipe(gulp.dest('./dist/')));
  }

  streams.push(gulp.src('./src/welcome/build/**/*')
    .pipe(gulp.dest('./dist/')));

  return merge(streams);
});

/**
 * Cleans the Welcome project
 */
gulp.task('clean:welcome', function() {
  del.sync(['./src/welcome/build']);
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
        './src/minimal/build/**/jquery.min.js',
        './src/minimal/build/**/popper.min.js',
        './src/minimal/build/**/bootstrap.min.?(js|css)',
        './src/minimal/build/**/fontawesome-all.min.js',
        './src/minimal/build/**/anchor.min.js',
        './src/minimal/build/**/site?(.min).?(js|css)'
      ], { read: false }), injectOpts),
      inject(gulp.src([
        './src/minimal/build/**/jquery.js?(.map)',
        './src/minimal/build/**/popper.js?(.map)',
        './src/minimal/build/**/bootstrap.?(js|css)?(.map)',
        './src/minimal/build/**/fontawesome-all.js',
        './src/minimal/build/**/anchor.js?(.map)',
        './src/minimal/build/**/site?(.min).?(js|css)'
      ], { read: false }), injectOpts)
    ))
    .pipe(gulpif(config.production(), cdnizer(cdn)))
    .pipe(gulpif(config.production(), htmlmin(htmlminOpts)))
    .pipe(gulp.dest('./src/minimal/build/'));
});

/**
 * Copies the Minimal project dependencies to the output folder
 */
gulp.task('build:minimal:deps', ['clean:minimal'], function() {
  var streams = [];

  if (config.production()){
    streams.push(gulp.src(bootstrap.min.js)
      .pipe(gulp.dest('./src/minimal/build/js/')));

    streams.push(gulp.src(bootstrap.min.css)
      .pipe(gulp.dest('./src/minimal/build/css/')));

    streams.push(gulp.src(anchor.min.js)
      .pipe( gulp.dest('./src/minimal/build/js/')));

    streams.push(gulp.src(fontawesome.min.js)
      .pipe(gulp.dest('./src/minimal/build/js/')));
  } else {
    streams.push(gulp.src(bootstrap.js)
      .pipe(gulp.dest('./src/minimal/build/js/')));

    streams.push(gulp.src(bootstrap.css)
      .pipe(gulp.dest('./src/minimal/build/css/')));

    streams.push(gulp.src(anchor.js)
      .pipe(gulp.dest('./src/minimal/build/js/')));

    streams.push(gulp.src(fontawesome.js)
      .pipe(gulp.dest('./src/minimal/build/js/')));

    streams.push(gulp.src(faviconArray)
      .pipe(gulp.dest('./src/minimal/build/')));
  }

  streams.push(gulp.src('./src/minimal/src/**/*.css')
    .pipe(gulpif(config.production(), minify()))
    .pipe(gulpif(config.production(), rename({ extname: '.min.css' })))
    .pipe(gulp.dest('./src/minimal/build/')));

  streams.push(gulp.src('./src/minimal/src/**/*.js')
    .pipe(gulpif(config.production(), uglify()))
    .pipe(gulpif(config.production(), rename({ extname: '.min.js' })))
    .pipe(gulp.dest('./src/minimal/build/')));

  streams.push(gulp.src('./assets/i18n/data.*.json')
    .pipe(gulpif(config.production(), jsonminify()))
    .pipe(gulp.dest('./src/minimal/build/i18n/')));

  return merge(streams);
});

/**
 * Packages the Minimal build
 */
gulp.task('package:minimal', ['build:minimal'], function() {
  var streams = [];

  del.sync([
    './src/minimal/build/i18n',
    './src/minimal/build/?(favicon.*|apple-touch-icon-precomposed.png)'
  ]);

  if (config.production()) {
    del.sync([
      './src/minimal/build/css/!(site)*.min.css',
      './src/minimal/build/js/!(site)*.min.js'
    ]);

    delete_empty.sync('./src/minimal/build/');

    streams.push(gulp.src(faviconArray)
      .pipe(gulp.dest('./dist/')));
  }

  streams.push(gulp.src('./src/minimal/build/**/*')
    .pipe(gulp.dest('./dist/resumes/minimal/')));

  return merge(streams);
});

/**
 * Cleans the Minimal project
 */
gulp.task('clean:minimal', function() {
  del.sync(['./src/minimal/build']);
});

/**
 * Builds the Angular project
 */
gulp.task('build:angular', ['build:angular:deps'], function(done) {
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

gulp.task('build:angular:deps', ['clean:angular'], function() {
  var streams = [];

  streams.push(gulp.src('./assets/i18n/*')
    .pipe(gulp.dest('./src/angular/src/assets/i18n/')));

  streams.push(gulp.src('./assets/icons/favicon.ico')
    .pipe(gulp.dest('./src/angular/src/assets/')));

  streams.push(gulp.src('./assets/icons/*.svg')
    .pipe(gulp.dest('./src/angular/src/assets/icons/')));

  streams.push(gulp.src('./assets/fonts/*')
    .pipe(gulp.dest('./src/angular/src/assets/fonts/')));

  return merge(streams);
});

/**
 * Packages the Angular build
 */
gulp.task('package:angular', ['build:angular'], function() {
  if (config.production()) {
    del.sync(['./src/angular/build/assets']);
  }

  return gulp.src('./src/angular/build/**/*')
    .pipe(gulp.dest('./dist/resumes/angular/'));
});

/**
 * Cleans the Angular project
 */
gulp.task('clean:angular', function() {
  del.sync([
    './src/angular/build',
    './src/angular/src/assets'
  ]);
});

/**
 * Builds and runs all projects in a local webserver
 */
gulp.task('run', ['package'], function() {
  webserverOpts.fallback = 'resumes/angular/index.html';

  return gulp.src('./dist')
    .pipe(webserver(webserverOpts))
});

/**
 * Runs the Welcome project in a local webserver
 */
gulp.task('run:welcome', ['build:welcome'], function(done) {
  gulp.src('./src/welcome/build').pipe(webserver(webserverOpts));
  gulp.watch('./src/welcome/src/**/*', watchOpts, ['build:welcome']);
  done();
});

/**
 * Runs the Minimal project in a local webserver
 */
gulp.task('run:minimal', ['build:minimal'], function(done) {
  gulp.src('./src/minimal/build').pipe(webserver(webserverOpts));
  gulp.watch('./src/minimal/src/**/*', watchOpts, ['build:minimal']);
  done();
});

/**
 * Runs the Angular project in a local webserver
 */
gulp.task('run:angular', ['build:angular:deps'], function() {
  if (config.development()) {
      child_process.execSync('ng serve --open', function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });
  } else if (config.production()) {
    child_process.execSync('ng serve --open --prod', function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });
  }
});
