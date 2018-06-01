'use strict';

var gulp = require('gulp'),
    del = require('del'),
    fs = require('fs'),
    delete_empty = require('delete-empty'),
    yargs = require('yargs'),
    merge = require('merge-stream'),
    child_process = require('child_process'),
    uglify = require('gulp-uglify'),
    postcss = require('gulp-postcss'),
    cssnano = require('cssnano'),
    autoprefixer = require('autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    htmlmin = require('gulp-htmlmin'),
    jsonminify = require('gulp-jsonminify'),
    sequence = require('gulp-sequence'),
    zip = require('gulp-zip'),
    webserver = require('gulp-webserver'),
    gulpif = require('gulp-if'),
    inject = require('gulp-inject'),
    rename = require('gulp-rename'),
    cdnizer = require('gulp-cdnizer'),
    concat = require('gulp-concat'),
    replace = require('gulp-replace'),
    mkdirp = require('mkdirp');

var config = {
  args: {
    skip: yargs.argv.skip,
    runtime: yargs.argv.rid,
    environment: yargs.argv.env || 'development'
  },
  opts: {
    webserver: {
      open: true,
      livereload: true
    },
    htmlmin: {
      collapseWhitespace: true,
      removeComments: true
    },
    watch: {
      delay: 10
    },
    inject: {
      relative: true,
      ignorePath: ['../build/']
    }
  },
  favicons: [
    './assets/icons/favicon.ico'
  ],
  vendor: {
    bootstrap: {
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
    },
    fontawesome: {
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
    },
    anchor: {
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
    }
  },
  analytics: {
    tag: '<!-- tag:gtag.js -->',
    code: [
      '<script async src="https://www.googletagmanager.com/gtag/js?id=UA-120214520-1"></script>',
      '<script>',
        'window.dataLayer=window.dataLayer || [];',
        'function gtag(){dataLayer.push(arguments);}',
        'gtag("js",new Date());',
        'gtag("config","UA-120214520-1");',
      '</script>'
    ]
  },
  development: function() {
    return this.args.environment === 'development' || this.args.environment === 'dev';
  },
  production: function() {
    return this.args.environment === 'production' || this.args.environment === 'prod';
  },
  skipMinimal: function() {
    return this.skipProject('minimal');
  },
  skipAngular: function() {
    return this.skipProject('angular');
  },
  skipDotNetCore: function() {
    return this.skipProject('dotnetcore');
  },
  skipProject: function(project) {
    if (!this.args.skip || typeof this.args.skip != 'string') {
      return false;
    }
    var projectsToSkip = this.args.skip.split(",");
    if (projectsToSkip.includes(project)) {
      return true;
    }
    return false;
  }
};
var packageJSON = null;

function readPackageJSON() {
  if (!packageJSON) {
    packageJSON = JSON.parse(fs.readFileSync('./package.json'))
  }
  return packageJSON;
}

config.version = readPackageJSON().version;
config.license = readPackageJSON().license;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   _____ _      ____  ____          _
//  / ____| |    / __ \|  _ \   /\   | |
// | |  __| |   | |  | | |_) | /  \  | |
// | | |_ | |   | |  | |  _ < / /\ \ | |
// | |__| | |___| |__| | |_) / ____ \| |____
//  \_____|______\____/|____/_/    \_\______|
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Cleans and builds the entire project
 */
gulp.task('default', ['build']);

/**
* Cleans the project output files
*/
gulp.task('clean', [
  'clean:welcome',
  'clean:minimal',
  'clean:angular',
  'clean:dotnetcore'
], function() {
  del.sync(['./dist', './bundle.zip']);
});

/**
 * Builds all projects
 */
gulp.task('build', sequence('clean', [
  'build:welcome',
  'build:minimal',
  'build:angular',
  'build:dotnetcore'
]));

/**
 * Packages all files and place them in the ./dist/ directory
 */
gulp.task('package', sequence('clean', [
  'package:assets',
  'package:welcome',
  'package:minimal',
  'package:angular',
  'package:dotnetcore'
]));

/**
 * Package the asset files in the ./dist/ directory
 */
gulp.task('package:assets', function() {
  var streams = [];

  if (config.development()) {
    streams.push(gulp.src('./assets/fonts/*')
      .pipe(gulp.dest('./dist/assets/fonts/')));
  }

  streams.push(gulp.src('./assets/i18n/*.json')
    .pipe(gulpif(config.production(), jsonminify()))
    .pipe(gulp.dest('./dist/assets/i18n/')));

  streams.push(gulp.src('./assets/icons/*.svg')
    .pipe(gulp.dest('./dist/assets/icons/')));

  return merge(streams);
});

/**
 * Builds and runs all projects in a local webserver
 */
gulp.task('run', ['package'], function() {
  var kestrelServerArgs = ['Resume.dll'];
  var kestrelServerEnv = config.production() ? 'Production' : 'Development';
  var kestrelServerOpts = {
    cwd: './dist/resumes/dotnetcore',
    env: {
      ASPNETCORE_ENVIRONMENT: kestrelServerEnv,
      ASPNETCORE_BASEADDRESS: 'http://localhost:8000/',
      ASPNETCORE_DATAPATH: '/assets/i18n/',
      ASPNETCORE_BASEHREF: '/resumes/dotnetcore/',
      DOTNET_PRINT_TELEMETRY_MESSAGE: false
    }
  };
  var kestrelServer = child_process.spawn('dotnet', kestrelServerArgs, kestrelServerOpts);

  if (kestrelServer) {
    kestrelServer.stdout.on('data', function(data) {
      console.log(data.toString());
    });

    kestrelServer.stderr.on('data', function(data) {
      console.log(data.toString());
    });
  }

  config.opts.webserver.fallback = 'resumes/angular/index.html';
  config.opts.webserver.proxies = [
    { source: '/resumes/dotnetcore/', target: 'http://localhost:5000' },
  ];

  return gulp.src('./dist')
    .pipe(webserver(config.opts.webserver));
});

/**
 * After building all projects, zips up the dist/ folder for deployment
 */
gulp.task('bundle', ['package'], function() {
  return gulp.src('./dist/**/*')
    .pipe(zip('bundle.zip'))
    .pipe(gulp.dest('.'));
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// __          ________ _      _____ ____  __  __ ______
// \ \        / /  ____| |    / ____/ __ \|  \/  |  ____|
//  \ \  /\  / /| |__  | |   | |   | |  | | \  / | |__
//   \ \/  \/ / |  __| | |   | |   | |  | | |\/| |  __|
//    \  /\  /  | |____| |___| |___| |__| | |  | | |____
//     \/  \/   |______|______\_____\____/|_|  |_|______|
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Cleans the Welcome project
 */
gulp.task('clean:welcome', function() {
  del.sync(['./modules/welcome/build']);
});

/**
 * Builds the Welcome project
 */
gulp.task('build:welcome', ['build:welcome:deps'], function() {
  var cdn = [].concat(config.vendor.bootstrap.cdn).concat(config.vendor.fontawesome.cdn);

  return gulp.src(['./modules/welcome/src/**/*.html'])
    .pipe(inject(gulp.src([
        './modules/welcome/build/**/jquery?(.min).js',
        './modules/welcome/build/**/popper?(.min).js',
        './modules/welcome/build/**/bootstrap?(.min).?(js|css)',
        './modules/welcome/build/**/fontawesome-all?(.min).js',
        './modules/welcome/build/**/?(site|styles)?(.min).css',
        './modules/welcome/build/**/?(site|scripts)?(.min).js'
      ], { read: false }), config.opts.inject)
    )
    .pipe(replace('${version}', config.version))
    .pipe(replace('${license}', config.license))
    .pipe(gulpif(config.production(), replace(config.analytics.tag, config.analytics.code.join(' '))))
    .pipe(gulpif(config.production(), cdnizer(cdn)))
    .pipe(gulp.dest('./modules/welcome/build/'));
});

/**
 * Copies the Welcome project dependencies to the output folder
 */
gulp.task('build:welcome:deps', ['clean:welcome'], function() {
  var streams = [];

  if (config.production()) {
    streams.push(gulp.src(config.vendor.bootstrap.min.js)
      .pipe(gulp.dest('./modules/welcome/build/js/')));

    streams.push(gulp.src(config.vendor.bootstrap.min.css)
      .pipe(gulp.dest('./modules/welcome/build/css/')));

    streams.push(gulp.src(config.vendor.fontawesome.min.js)
      .pipe(gulp.dest('./modules/welcome/build/js/')));
  } else {
    streams.push(gulp.src(config.vendor.bootstrap.js)
      .pipe(gulp.dest('./modules/welcome/build/js/')));

    streams.push(gulp.src(config.vendor.bootstrap.css)
      .pipe(gulp.dest('./modules/welcome/build/css/')));

    streams.push(gulp.src(config.vendor.fontawesome.js)
      .pipe(gulp.dest('./modules/welcome/build/js/')));
  }

  streams.push(gulp.src(config.favicons)
    .pipe(gulp.dest('./modules/welcome/build/')));

  streams.push(gulp.src(['./modules/welcome/src/img/*.?(png|jpg|ico)'])
    .pipe(gulp.dest('./modules/welcome/build/img/')));

  streams.push(gulp.src(['./modules/welcome/src/css/*.css'])
    .pipe(gulpif(config.development(), sourcemaps.init()))
    .pipe(gulpif(config.production(),
      postcss([autoprefixer(), cssnano()]),
      postcss([autoprefixer()])
    ))
    .pipe(gulpif(config.production(), concat('styles.min.css')))
    .pipe(gulpif(config.development(), sourcemaps.write('.')))
    .pipe(replace(/url\('?.+\/(.+?)'?\)/g, 'url(\'img/$1\')'))
    .pipe(gulp.dest('./modules/welcome/build/')));

  streams.push(gulp.src(['./modules/welcome/src/js/*.js'])
    .pipe(gulpif(config.development(), sourcemaps.init()))
    .pipe(gulpif(config.production(), uglify()))
    .pipe(gulpif(config.production(), concat('scripts.min.js')))
    .pipe(gulpif(config.development(), sourcemaps.write('.')))
    .pipe(gulp.dest('./modules/welcome/build/')));

  return merge(streams);
});

/**
 * Packages the Welcome build
 */
gulp.task('package:welcome', ['build:welcome'], function() {
  var streams = [];

  if (config.production()) {
    del.sync([
      './modules/welcome/build/css/!(site|styles)*.min.css',
      './modules/welcome/build/js/!(site|scripts)*.min.js'
    ]);

    delete_empty.sync('./modules/welcome/build/');

    streams.push(gulp.src(config.favicons)
      .pipe(gulp.dest('./dist/')));
  }

  streams.push(gulp.src('./modules/welcome/build/img/*')
    .pipe(gulp.dest('./dist/assets/images/')));

  streams.push(gulp.src('./modules/welcome/build/**/*.?(css|js)?(.map)')
    .pipe(replace(/url\('?.+\/(.+?)'?\)/g, 'url(\'assets/images/$1\')'))
    .pipe(gulp.dest('./dist/')));

  streams.push(gulp.src('./modules/welcome/build/**/*.html')
    .pipe(gulpif(config.production(), htmlmin(config.opts.htmlmin)))
    .pipe(gulp.dest('./dist/')));

  return merge(streams);
});

/**
 * Runs the Welcome project in a local webserver
 */
gulp.task('run:welcome', ['build:welcome'], function(done) {
  gulp.src('./modules/welcome/build').pipe(webserver(config.opts.webserver));
  gulp.watch('./modules/welcome/src/**/*', config.opts.watch, ['build:welcome']);
  done();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// __  __ _____ _   _ _____ __  __          _
// |  \/  |_   _| \ | |_   _|  \/  |   /\   | |
// | \  / | | | |  \| | | | | \  / |  /  \  | |
// | |\/| | | | | . ` | | | | |\/| | / /\ \ | |
// | |  | |_| |_| |\  |_| |_| |  | |/ ____ \| |____
// |_|  |_|_____|_| \_|_____|_|  |_/_/    \_\______|
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Cleans the Minimal project
 */
gulp.task('clean:minimal', function() {
  if (!config.skipMinimal()) {
    del.sync(['./modules/minimal/build']);
  }
});

/**
 * Builds the Minimal project
 */
gulp.task('build:minimal', ['build:minimal:deps'], function() {
  if (config.skipMinimal()) {
    return;
  }

  var cdn = []
    .concat(config.vendor.bootstrap.cdn)
    .concat(config.vendor.fontawesome.cdn)
    .concat(config.vendor.anchor.cdn);

  return gulp.src('./modules/minimal/src/**/*.html')
    .pipe(inject(gulp.src([
        './modules/minimal/build/**/jquery?(.min).js',
        './modules/minimal/build/**/popper?(.min).js',
        './modules/minimal/build/**/bootstrap?(.min).?(js|css)',
        './modules/minimal/build/**/fontawesome-all?(.min).js',
        './modules/minimal/build/**/anchor?(.min).js',
        './modules/minimal/build/**/?(site|styles)?(.min).css',
        './modules/minimal/build/**/?(site|scripts)?(.min).js'
      ], { read: false }), config.opts.inject)
    )
    .pipe(gulpif(config.production(), replace(config.analytics.tag, config.analytics.code.join(' '))))
    .pipe(gulpif(config.production(), cdnizer(cdn)))
    .pipe(gulp.dest('./modules/minimal/build/'));
});

/**
 * Copies the Minimal project dependencies to the output folder
 */
gulp.task('build:minimal:deps', ['clean:minimal'], function() {
  if (config.skipMinimal()) {
    return;
  }

  var streams = [];

  if (config.production()){
    streams.push(gulp.src(config.vendor.bootstrap.min.js)
      .pipe(gulp.dest('./modules/minimal/build/js/')));

    streams.push(gulp.src(config.vendor.bootstrap.min.css)
      .pipe(gulp.dest('./modules/minimal/build/css/')));

    streams.push(gulp.src(config.vendor.anchor.min.js)
      .pipe( gulp.dest('./modules/minimal/build/js/')));

    streams.push(gulp.src(config.vendor.fontawesome.min.js)
      .pipe(gulp.dest('./modules/minimal/build/js/')));
  } else {
    streams.push(gulp.src(config.vendor.bootstrap.js)
      .pipe(gulp.dest('./modules/minimal/build/js/')));

    streams.push(gulp.src(config.vendor.bootstrap.css)
      .pipe(gulp.dest('./modules/minimal/build/css/')));

    streams.push(gulp.src(config.vendor.anchor.js)
      .pipe(gulp.dest('./modules/minimal/build/js/')));

    streams.push(gulp.src(config.vendor.fontawesome.js)
      .pipe(gulp.dest('./modules/minimal/build/js/')));
  }

  streams.push(gulp.src(config.favicons)
      .pipe(gulp.dest('./modules/minimal/build/')));

  streams.push(gulp.src('./assets/i18n/data.*.json')
    .pipe(gulpif(config.production(), jsonminify()))
    .pipe(gulp.dest('./modules/minimal/build/i18n/')));

  streams.push(gulp.src('./modules/minimal/src/css/*.css')
    .pipe(gulpif(config.development(), sourcemaps.init()))
    .pipe(gulpif(config.production(),
      postcss([autoprefixer(), cssnano()]),
      postcss([autoprefixer()])
    ))
    .pipe(gulpif(config.production(), concat('styles.min.css')))
    .pipe(gulpif(config.development(), sourcemaps.write('.')))
    .pipe(gulp.dest('./modules/minimal/build/')));

  streams.push(gulp.src('./modules/minimal/src/js/*.js')
    .pipe(gulpif(config.development(), sourcemaps.init()))
    .pipe(gulpif(config.production(), uglify()))
    .pipe(gulpif(config.production(), concat('scripts.min.js')))
    .pipe(gulpif(config.development(), sourcemaps.write('.')))
    .pipe(gulp.dest('./modules/minimal/build/')));

  return merge(streams);
});

/**
 * Packages the Minimal build
 */
gulp.task('package:minimal', ['build:minimal'], function() {
  if (config.skipMinimal()) {
    return;
  }

  var streams = [];

  if (config.production()) {
    del.sync([
      './modules/minimal/build/i18n',
      './modules/minimal/build/favicon.ico',
      './modules/minimal/build/css/!(site|styles)*.min.css',
      './modules/minimal/build/js/!(site|scripts)*.min.js'
    ]);

    delete_empty.sync('./modules/minimal/build/');

    streams.push(gulp.src(config.favicons)
      .pipe(gulp.dest('./dist/')));
  }

  streams.push(gulp.src('./modules/minimal/build/**/*.?(css|js)?(.map)')
    .pipe(replace('/i18n/', '/assets/i18n/'))
    .pipe(gulp.dest('./dist/resumes/minimal/')));

  streams.push(gulp.src('./modules/minimal/build/**/*.html')
    .pipe(gulpif(config.production(), htmlmin(config.opts.htmlmin)))
    .pipe(gulp.dest('./dist/resumes/minimal/')));

  return merge(streams);
});

/**
 * Runs the Minimal project in a local webserver
 */
gulp.task('run:minimal', ['build:minimal'], function(done) {
  gulp.src('./modules/minimal/build').pipe(webserver(config.opts.webserver));
  gulp.watch(['./modules/minimal/src/**/*', './assets/i18n/*.json'], config.opts.watch, ['build:minimal']);
  done();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//           _   _  _____ _    _ _               _____
//     /\   | \ | |/ ____| |  | | |        /\   |  __ \
//    /  \  |  \| | |  __| |  | | |       /  \  | |__) |
//   / /\ \ | . ` | | |_ | |  | | |      / /\ \ |  _  /
//  / ____ \| |\  | |__| | |__| | |____ / ____ \| | \ \
// /_/    \_\_| \_|\_____|\____/|______/_/    \_\_|  \_\
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Cleans the Angular project
 */
gulp.task('clean:angular', function() {
  if (!config.skipAngular()) {
    del.sync([
      './modules/angular/build',
      './modules/angular/src/assets'
    ]);
  }
});

/**
 * Builds the Angular project
 */
gulp.task('build:angular', ['build:angular:deps'], function(done) {
  if (config.skipAngular()) {
    done();
    return;
  }

  var command = 'ng build --base-href /resumes/angular/ --deploy-url /resumes/angular/';

  if (config.production()) {
    command += ' --prod';
  }

  child_process.exec(command, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
});

/**
 * Copies the Angular dependencies to the assets folder for the CLI to pick up.
 */
gulp.task('build:angular:deps', ['clean:angular'], function() {
  if (config.skipAngular()) {
    return;
  }

  var streams = [];

  streams.push(gulp.src('./assets/i18n/*')
    .pipe(gulp.dest('./modules/angular/src/assets/i18n/')));

  streams.push(gulp.src('./assets/icons/favicon.ico')
    .pipe(gulp.dest('./modules/angular/src/assets/')));

  streams.push(gulp.src('./assets/icons/*.svg')
    .pipe(gulp.dest('./modules/angular/src/assets/icons/')));

  streams.push(gulp.src('./assets/fonts/*')
    .pipe(gulp.dest('./modules/angular/src/assets/fonts/')));

  return merge(streams);
});

/**
 * Packages the Angular build
 */
gulp.task('package:angular', ['build:angular'], function() {
  if (config.skipAngular()) {
    return;
  }

  if (config.production()) {
    del.sync(['./modules/angular/build/assets']);
  }

  return gulp.src('./modules/angular/build/**/*')
    .pipe(gulp.dest('./dist/resumes/angular/'));
});

/**
 * Runs the Angular project in a local webserver
 */
gulp.task('run:angular', ['build:angular:deps'], function() {
  var args = ['./node_modules/@angular/cli/bin/ng', 'serve', '--open'];

  if (config.production()) {
    args.push('--prod');
  }

  var nodeApp = child_process.spawn('node', args);

  if (nodeApp) {
    nodeApp.stdout.on('data', function(data) {
      console.log(data.toString());
    });

    nodeApp.stderr.on('data', function(data) {
      console.log(data.toString());
    });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     _   _ ______ _______    _____ ____  _____  ______
//    | \ | |  ____|__   __|  / ____/ __ \|  __ \|  ____|
//    |  \| | |__     | |    | |   | |  | | |__) | |__
//    | . ` |  __|    | |    | |   | |  | |  _  /|  __|
//  _ | |\  | |____   | |    | |___| |__| | | \ \| |____
// (_)|_| \_|______|  |_|     \_____\____/|_|  \_\______|
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Cleans the .NET Core project
 */
gulp.task('clean:dotnetcore', function(done) {
  if (config.skipDotNetCore()) {
    done();
    return;
  }

  var command = 'dotnet clean modules/dotnetcore/Resume.csproj --verbosity quiet';

  if (config.production()) {
    command += ' --configuration Release';
  }

  child_process.exec(command, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);

    del.sync([
      './modules/dotnetcore/?(bin|obj)',
      './modules/dotnetcore/wwwroot/css/!(site)*?(.min).css?(.map)',
      './modules/dotnetcore/wwwroot/js/!(site)*?(.min).js?(.map)'
    ]);

    done(err);
  });
});

/**
 * Builds the .NET Core project
 */
gulp.task('build:dotnetcore', ['build:dotnetcore:deps'], function(done) {
  if (config.skipDotNetCore()) {
    done();
    return;
  }

  var command = 'dotnet build modules/dotnetcore/Resume.csproj --verbosity quiet';

  if (config.production()) {
    command += ' --configuration Release';
  }

  child_process.exec(command, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
});

/**
 * Copies the .NET Core dependencies to the build folder.
 */
gulp.task('build:dotnetcore:deps', ['clean:dotnetcore'], function() {
  if (config.skipDotNetCore()) {
    return;
  }

  var streams = [];

  if (config.development()) {
    streams.push(gulp.src(config.favicons)
      .pipe(gulp.dest('./modules/dotnetcore/wwwroot/')));

    streams.push(gulp.src(config.vendor.bootstrap.js)
      .pipe(gulp.dest('./modules/dotnetcore/wwwroot/js/')));

    streams.push(gulp.src(config.vendor.bootstrap.css)
      .pipe(gulp.dest('./modules/dotnetcore/wwwroot/css/')));

    streams.push(gulp.src(config.vendor.anchor.js)
      .pipe(gulp.dest('./modules/dotnetcore/wwwroot/js/')));

    streams.push(gulp.src(config.vendor.fontawesome.js)
      .pipe(gulp.dest('./modules/dotnetcore/wwwroot/js/')));

    streams.push(gulp.src('./assets/i18n/*')
      .pipe(gulp.dest('./modules/dotnetcore/wwwroot/i18n/')));
  }

  return streams.length > 0 ? merge(streams) : null;
});

/**
 * Packages the .NET Core build
 */
gulp.task('package:dotnetcore', ['build:dotnetcore:deps'], function(done) {
  if (config.skipDotNetCore()) {
    done();
    return;
  }

  mkdirp.sync('./dist/resumes/dotnetcore');

  var command = 'dotnet publish modules/dotnetcore/Resume.csproj --verbosity quiet --output ../../dist/resumes/dotnetcore';

  if (config.runtime) {
    command += (' --runtime ' + config.runtime);
  }

  if (config.production()) {
    del.sync([
      './modules/dotnetcore/wwwroot/favicon.ico',
      './modules/dotnetcore/wwwroot/css/**/!(site)*.css?(.map)',
      './modules/dotnetcore/wwwroot/js',
      './modules/dotnetcore/wwwroot/i18n'
    ]);

    command += ' --configuration Release';
  }

  child_process.exec(command, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);

    if (config.production()) {
      del.sync([
        './dist/resumes/dotnetcore/*.pdb',
        './dist/resumes/dotnetcore/appsettings.Development.json'
      ]);
    }

    done(err);
  });
});

/**
 * Runs the .NET Core project in a local webserver
 */
gulp.task('run:dotnetcore', ['build:dotnetcore:deps'], function(done) {
  var env = 'Development';
  var args = ['run', '--project', 'Resume.csproj', '--verbosity', 'quiet'];

  if (config.production()) {
    env = 'Production';
    args.concat(['--configuration', 'Release']);
  }

  var opts = {
    cwd: './modules/dotnetcore'
  };

  var dotnetApp = child_process.spawn('dotnet', args, opts);

  if (dotnetApp) {
    dotnetApp.stdout.on('data', function(data) {
      console.log(data.toString());
    });

    dotnetApp.stderr.on('data', function(data) {
      console.log(data.toString());
    });
  }

  done();
});
