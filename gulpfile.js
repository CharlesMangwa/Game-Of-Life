/* ---

  INSTALL :

  npm istall

--- */











/* -------------------------------- 

   Browser Sync

-------------------------------- */

var gulp        = require('gulp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

gulp.task('browser_sync', function() {
    browserSync({
        server: {
            baseDir: "./src/"
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});










/* -------------------------------- 

   Stylesheet Dev

-------------------------------- */

var sourcemaps = require('gulp-sourcemaps');
var sass       = require('gulp-sass');

gulp.task('stylesheet_dev', function(){  
    gulp.src(['src/sass/**'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', function (err) { console.log(err.message); } )  
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./src/css'))
        .pipe(reload({stream:true}));
});










/* -------------------------------- 

   Stylesheet Prod

-------------------------------- */

var pleeease      = require('gulp-pleeease');
var cssbeautify   = require('gulp-cssbeautify');
var rename        = require('gulp-rename');

var PleeeaseOptions = {
    minifier: true, 
    mqpacker: false
};

gulp.task('stylesheet_prod', function(){  
    gulp.src(['src/css/*.css'])
        .pipe(cssbeautify())
        .pipe(gulp.dest('prod/css/'));    
    
});










/* -------------------------------- 

   Images

-------------------------------- */

var imagemin    = require('gulp-imagemin');
var pngcrush    = require('imagemin-pngcrush');

gulp.task('img', function(){
    gulp.src(['src/img/**'])
        /*.pipe(imagemin())*/
        .pipe(gulp.dest('prod/img'));    
});












/* -------------------------------- 

   Fonts

-------------------------------- */

gulp.task('fonts', function(){
    gulp.src(['src/fonts/**'])
        .pipe(gulp.dest('prod/fonts'));    
});












/* -------------------------------- 

   Clean

-------------------------------- */

var rimraf      = require('gulp-rimraf');

gulp.task('clean', function(){
    gulp.src('./prod')        
        .pipe(rimraf());
});












/* -------------------------------- 

   Useref

-------------------------------- */

var gulpif      = require('gulp-if');
var uglify      = require('gulp-uglify');
var useref      = require('gulp-useref');
var assets      = useref.assets();   
var minifyCSS   = require('gulp-minify-css');

var PleeeaseOptions = {
    minifier: true, 
    mqpacker: false
};


gulp.task('useref', function(){
    gulp.src('src/*.html')
        .pipe(assets)
        .pipe(gulpif('*.css', minifyCSS({keepSpecialComments : 0})))
        .pipe(gulpif('*.js', uglify()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('prod/'));
    
    
});









/* -------------------------------- 

   Prod

-------------------------------- */

gulp.task('prod', ['clean', 'useref', 'stylesheet_prod', 'img', 'fonts'], function(){
    //gulp.src('src/js/**/*.map').pipe(gulp.dest('prod/js/'));  //
});










/* -------------------------------- 

   ZIP

-------------------------------- */

var zip         = require('gulp-zip');

gulp.task('zip', ['prod'], function() {
    gulp.src('prod/**/*')
        .pipe(zip('prod.zip'))
        .pipe(gulp.dest('./'));
});









/* -------------------------------- 

   React

-------------------------------- */

var reactify    = require('reactify');
var browserify  = require('gulp-browserify');
var include     = require('gulp-include');

gulp.task('react', function() {
    gulp.src(['src/js/app/src/**.js', 'src/js/app/src/**/*.js'], { read: true })
        .pipe(include())
        .pipe(browserify({
          transform: [reactify]
        }))
        .on('error', function (err) { console.log(err.message); } )  
        .pipe(gulp.dest('./src/js/app/build/'))
        .pipe(reload({stream:true}));
});







/* -------------------------------- 

   Dev

-------------------------------- */

gulp.task('dev', ['browser_sync', 'react', 'stylesheet_dev'], function () {
    gulp.watch(["src/sass/**"], ['stylesheet_dev']);
    gulp.watch(["src/js/app/src/**.js", "src/js/app/src/**/*.js"], ['react']);
    gulp.watch("src/css/*.css", ['bs-reload']);
    gulp.watch("src/*.html", ['bs-reload']);
});


