import gulp from 'gulp';
import path from 'path';
import webpack from 'webpack-stream';
import uglify from 'gulp-uglify';
const browserSync = require('browser-sync');

// 错误通知
const notify = require('gulp-notify');
const errorHandle = function(){
  const args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'compile error',
    message: '<%=error.message %>',
  }).apply(this, args); // 替换为当前对象
  this.emit(); // 提交
};

// 防止因为错误导致的进程挂起 watch 失效
const plumber = require('gulp-plumber');


/* ------------------gulp start----------------------------*/
const reload = () => browserSync.reload();
const root = 'client';

const paths = {
  js: path.join(root, 'app/**/*.js'),
  styl: path.join(root, '**/*.scss'),
  html: [
    path.join(root, '**/*.html'),
    path.join(root, 'index.html'),
  ],
  widget: path.join(root, '/widget/widget.js'),
  entry: path.join(root, 'app/app.js'),
  vendor: path.join(root, 'app/vendor.js'),
  output: root,
};

gulp.task('webpack', () =>
    gulp.src(paths.entry)
    .pipe(plumber())
    .pipe(webpack(require('./webpack.config')))
    .on('error', errorHandle)
    .pipe(gulp.dest(path.join(paths.output, 'build')))
  );

gulp.task('vendor', () =>
  gulp.src(paths.vendor)
    .pipe(webpack(require('./webpack.config.vendor')))
    .pipe(uglify())
    .pipe(gulp.dest(path.join(paths.output, 'build')))
);

gulp.task('reload', ['webpack'], (done) => {
  reload();
  done();
});

gulp.task('serve', ['vendor', 'webpack'], () => {
  browserSync({
    port: process.env.PORT || 8080,
    open: true,
    server: { baseDir: root },
  });
});

gulp.task('watch', ['serve'], () => {
  const allPaths = [].concat([paths.js], paths.html, [paths.styl], [paths.widget]);
  gulp.watch(allPaths, ['reload']);
});

gulp.task('default', ['watch']);
