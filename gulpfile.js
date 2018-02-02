const gulp = require('gulp');
const changed = require('gulp-changed');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var iconfont = require('gulp-iconfont');
var runTimestamp = Math.round(Date.now()/1000);
var nodemon = require('gulp-nodemon');
var jsonminify = require('gulp-jsonminify');
var pump=require('pump');
const jshint = require('gulp-jshint');
var uglifyEsJs = require('gulp-uglify-es').default;
var reload = browserSync.reload;

var DEST='app/public/'
var DEST_SERVER='app/server/'

// minifying the images
gulp.task('imagemin', function() {
   var img_src = 'ico/app/public/images/**/*';
   var img_dest = DEST+'images/';
   gulp.src(img_src)
   .pipe(changed(img_dest))
   .pipe(imagemin())
   .pipe(gulp.dest(img_dest))
   .pipe(browserSync.stream());
});

// minify the styles
gulp.task('styles', function() {
   gulp.src(['ico/app/public/css/*.css'])
   .pipe(changed(DEST))
   .pipe(concat('styles.css'))
   .pipe(autoprefix('last 2 versions'))
   .pipe(minifyCSS())
   .pipe(gulp.dest(DEST+'css/'))
   .pipe(browserSync.stream());
});

// minfy the js controller file
gulp.task('scriptController', function() {
    return gulp.src([
        'ico/app/public/js/controllers/*.js',
      ])
      .pipe(changed(DEST))
      .pipe(concat('custom.js'))
      .pipe(gulp.dest(DEST+'js/controllers/'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(DEST+'js/controllers/'))
      .pipe(browserSync.stream());
});

// form validators js
gulp.task('scriptFormValid', function() {
    return gulp.src([
        'ico/app/public/js/form-validators/*.js',
      ])
      .pipe(changed(DEST))
      .pipe(concat('custom.js'))
      .pipe(gulp.dest(DEST+'js/form-validators/'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(DEST+'js/form-validators/'))
      .pipe(browserSync.stream());
});

// views minify data
gulp.task('scriptViews', function() {
    return gulp.src([
        'ico/app/public/js/views/*.js',
      ])
      .pipe(changed(DEST))
      .pipe(concat('custom.js'))
      .pipe(gulp.dest(DEST+'js/views/'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(DEST+'js/views/'))
      .pipe(browserSync.stream());
});

// for browser reloading thing
gulp.task('browser-sync',['nodemon'],function() {
  browserSync({
    proxy: "localhost:3000",  // local node app address
    port: 5000,  // use *different* port than above
    notify: true
  });
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: 'ico/app.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1000);
  });
});

// configuration files
gulp.task('minifyJson',function (){
    return gulp.src(['ico/config/*.json'])
        .pipe(changed(DEST))
        .pipe(jsonminify())
        .pipe(gulp.dest('config/'));
});


// server files
gulp.task('serverModules',function(){
  return gulp.src([
      'ico/app/server/modules/*.js',
    ])
    .pipe(concat('custom.js'))
    .pipe(gulp.dest('app/server/modules/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglifyEsJs())
    .pipe(gulp.dest(DEST+'app/server/modules/'))
    .pipe(browserSync.stream());
});

//debugging things
gulp.task('uglify-error-debugging', function (cb) {
  pump([
    gulp.src('ico/app/server/modules/*.js'),
    uglifyEsJs(),
    gulp.dest('./app/server/modules/')
  ], cb);
});


// default task
gulp.task('default',['browser-sync','serverModules','imagemin', 'styles','scriptViews','scriptFormValid','scriptController'], function(){
   gulp.watch('ico/app/public/css/*.css',['styles']);
   gulp.watch('ico/app/public/images/**/*',['imagemin']);
   gulp.watch('ico/app/public/js/controllers/*.js',['scriptController']);
   gulp.watch('ico/app/public/js/form-validators/*.js',['scriptFormValid']);
   gulp.watch('ico/app/public/js/views/*.js',['scriptViews']);
   gulp.watch('ico/app/config/*.json',['minifyJson']);
   gulp.watch('ico/app/server/*.js',['serverModules']);
   gulp.watch('ico/app/server/views/*.jade',reload);
});
