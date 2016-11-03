import gulp       from 'gulp';
import babel      from 'gulp-babel';
import uglify     from 'gulp-uglify';
import gutil      from 'gulp-util';

import source     from 'vinyl-source-stream';
import buffer     from 'vinyl-buffer';

import browserify from 'browserify';
import vueify     from 'vueify';
import babelify   from 'babelify';
import watchify   from 'watchify';
import hmr        from 'browserify-hmr';


gulp.task('default', ['build']);


const entry = './src/main.js';

let bundler;

gulp.task('browserify', () => {

  bundler = browserify({
    entries: entry,
    cache: {},
    packageCache: {}
  })
    .transform(vueify)
    .transform(babelify);
});


const outName = 'app.js',
      dest = './dist';

gulp.task('build', ['browserify'], () => {

  bundler.bundle()
    .pipe(source(outName))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(dest));
});


gulp.task('hmr', ['browserify'], () => {

  bundler.plugin(hmr)
    .plugin(watchify)
    .on('update', bundle);

  bundle();

  function bundle() {
    bundler.bundle()
      .on('error', err => {
        gutil.log('Browserify Error', gutil.colors.red(err.message));
      })
      .pipe(source(outName))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest(dest));
  }
});


gulp.task('vueify', () => {
  browserify(entry)
    .transform(vueify)
    .transform(babelify)
    .bundle()
    .pipe(source(outName))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(dest));
});

gulp.task('uglify', () => {
  gulp.src(entry)
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('./min'));
});

