const gulp = require('gulp');
const changed = require('gulp-changed');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var iconfont = require('gulp-iconfont');
var runTimestamp = Math.round(Date.now()/1000);


// minify the images
gulp.task('imagemin', function() {
   var img_src = 'innerve_2k17_website/img/**/*';
   var img_dest = 'build/img/';
   gulp.src(img_src)
   .pipe(changed(img_dest))
   .pipe(imagemin())
   .pipe(gulp.dest(img_dest))
   .pipe(browserSync.stream());

});

// minnify the styles
gulp.task('styles', function() {
   gulp.src(['innerve_2k17_website/css/*.css'])
   .pipe(concat('styles.css'))
   .pipe(autoprefix('last 2 versions'))
   .pipe(minifyCSS())
   .pipe(gulp.dest('build/styles/'))
   .pipe(browserSync.stream());
});

// minify the js files
gulp.task('scripts', function() {
    return gulp.src([
        'innerve_2k17_website/js/*.js',
      ])
      .pipe(concat('custom.js'))
      .pipe(gulp.dest('build/js/'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('build/js/'))
      .pipe(browserSync.stream());
});

// for browser reloading thing
gulp.task('browserSync', function() {
   browserSync.init({
      server: {
         baseDir: './'
      },
      startPath: './innerve_2k17_website/index.html'
   })
})


// since fonts are already optimized so we dont require it we directly copy it in destination folder
gulp.task('fonts', function() {
  return gulp.src('innerve_2k17_website/fonts/**/*')
  .pipe(gulp.dest('build/fonts'))
})

// task to delete the build folder
gulp.task('clean:build', function() {
  return del.sync('build');
})

// to clear cache we need can call this function
gulp.task('cache:clear', function (callback) {
return cache.clearAll(callback)
})


// default task to run multiple tasks in combination if the task name is default then only writing gulp will
// make run this task and will save some of the keys
gulp.task('default', ['browserSync','imagemin', 'styles','scripts','fonts'], function() {
   gulp.watch('innerve_2k17_website/css/*.css',['styles']);
   gulp.watch('innerve_2k17_website/img/**/*',['imagemin']);
   gulp.watch('innerve_2k17_website/js/*.js',['scripts']);
   gulp.watch('innerve_2k17_website/*.html', browserSync.reload);
});
