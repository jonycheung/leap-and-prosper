var gulp = require('gulp'),
	runSequence = require('run-sequence'),
	watch = require('gulp-watch'),
  nodemon = require('gulp-nodemon'),
	sass = require('gulp-sass');

gulp.task('default', function(callback) {
  // place code for your default task here
  runSequence(
  	// 'build',
              'watch',
               'serve',
              callback);
});
gulp.task('styles', function() {
   return gulp.src('scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'))
});
gulp.task('serve', function () {
  nodemon({ script: 'server/server.js', watch: 'server/' })
    .on('restart', function () {
      console.log('restarted!')
    })
});

gulp.task('watch', function () {
  gulp.watch('scss/**/*.scss',['styles']);
});