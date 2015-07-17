var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var mocha = require('gulp-mocha');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var file = require('gulp-file');
var argv = require('yargs').argv;
var shell = require('gulp-shell');


var path = {
  HTML: 'client/index.html',
  MINIFIED_OUT: 'build.min.js',
  OUT: 'build.js',
  DEST: 'client/dist',
  DEST_BUILD: 'client/dist/build',
  DEST_SRC: 'client/dist/src',
  ENTRY_POINT: './client/js/app.js',
  TEST_DIR: ['spec/*.js', 'spec/**/*.js']
};

gulp.task('htmlReplaceDev', function(){
  gulp.src(path.HTML)
  .pipe(htmlreplace({
    'js': 'src/' + path.OUT
  }))
    .pipe(gulp.dest(path.DEST));
});

gulp.task('watch', function(){
  gulp.watch(path.HTML, [ 'htmlReplaceDev' ]);

  var watcher = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  return watcher.on('update', function(){
    watcher.bundle()
      .pipe(source(path.OUT))
      .pipe(gulp.dest(path.DEST_SRC));
      console.log('Updated!');
  })
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_SRC));
});

gulp.task('test', function(){
  return gulp.src(path.TEST_DIR, {read: false})
          .pipe(mocha({reporter: 'nyan'}))
          .once('end', function() {
            process.exit();
          });
});

gulp.task('shell-db-create', shell.task([
  'psql postgres -c "CREATE DATABASE dev_supportal"',
  'psql postgres -c "CREATE DATABASE test_supportal"'
]));

gulp.task('shell-local-migrate', shell.task([
  'sequelize db:migrate --config config/personal_config.json',
  // 'sequelize db:migrate --config config/personal_config.json'
], process.chdir('server')));

gulp.task('write-personal-config', function() {
  var user = argv.user;

  var json = {
    "development": {
      "username": user,
      "password": null,
      "database": "dev_supportal",
      "host": "127.0.0.1",
      "dialect": "postgres"
    },
    "test": {
      "username": user,
      "password": null,
      "database": "test_supportal",
      "host": "127.0.0.1",
      "dialect": "postgres"
    }
  };

  var stringify = JSON.stringify(json);
  return file('personal_config.json', stringify)
    .pipe(gulp.dest('server/config'));
});

gulp.task('build', function(){
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
  })
  .bundle()
  .pipe(source(path.MINIFIED_OUT))
  .pipe(streamify(uglify(path.MINIFIED_OUT)))
  .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('replaceHTML', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': 'build/' + path.MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.DEST));
});

gulp.task('default', [ 'watch' ]);
gulp.task('production', [ 'replaceHTML', 'build' ]);
