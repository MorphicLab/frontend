const gulp = require('gulp');
const include = require('gulp-file-include');

gulp.task('html', function() {
  return gulp.src(['*.html'])
    .pipe(include({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./dist'));
}); 