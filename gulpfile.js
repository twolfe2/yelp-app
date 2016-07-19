'use strict';

const gulp = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const ngAnnotate = require('gulp-ng-annotate');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');


// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;

let paths = {
  html: {
    input: 'client/html/**/*.html',
    output: 'public/html'
  },
  js: {
    input: 'client/js/**/*.js',
    output: 'public/js'
  },
  css: {
    input: ['client/css/**/*.scss', 'client/css/**/*.sass'],
    output: 'public/css'
  },
  favicon: {
    input: './client/favicon.ico',
    output: './public'
  }
};



//gulp.task('taskName', [opt. prerequisites], function() {
//content of task (optional)
//})

gulp.task('default', ['build', 'watch','serve'], function() {

  console.log('default');

});


gulp.task('build', ['html', 'js', 'css', 'favicon']);

gulp.task('watch', ['watch:html','watch:js', 'watch:css']);


gulp.task('favicon', function () {
  return gulp.src(paths.favicon.input)
    .pipe(gulp.dest(paths.favicon.output));
})
//////////////HTML////////////////////////////


gulp.task('html', ['clean:html'], function() {
  return gulp.src(paths.html.input)
    .pipe(plumber())
    .pipe(gulp.dest(paths.html.output));
});

gulp.task('clean:html', function() {
  return del([paths.html.output]);
});


gulp.task('watch:html', function() {
  gulp.watch(paths.html.input, ['html', browserSync.reload]);

});

//////////////JS////////////////////////////

gulp.task('js', ['clean:js'], function() {
  return gulp.src(paths.js.input)
    .pipe(plumber())
    .pipe(sourcemaps.init())    
      .pipe(concat('bundle.js'))
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(ngAnnotate())
      .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.js.output));
});

gulp.task('clean:js', function() {
  return del([paths.js.output]);
});


gulp.task('watch:js', function() {
  gulp.watch(paths.js.input, ['js', browserSync.reload]);

});

///////////////CSS/////////////////////////////////

gulp.task('css', ['clean:css'], function() {
  return gulp.src(paths.css.input)
    .pipe(plumber())
    .pipe(browserSync.reload({stream: true}))
    .pipe(sass())
    .pipe(gulp.dest(paths.css.output));
});

gulp.task('clean:css', function() {
  return del([paths.css.output]);
});


gulp.task('watch:css', function() {
  gulp.watch(paths.css.input, ['css']);

});




///////browser sync///////

// gulp.task('nodemon', function (cb) {
//   var called = false;
//   return nodemon({

//     // nodemon our expressjs server
//     script: 'app.js',

//     // watch core server file(s) that require server restart on change
//     watch: ['app.js']
//   })
//     .on('start', function onStart() {
//       // ensure start only got called once
//       if (!called) { cb(); }
//       called = true;
//     })
//     .on('restart', function onRestart() {
//       // reload connected browsers after a slight delay
//       setTimeout(function reload() {
//         browserSync.reload({
//           stream: false
//         });
//       }, BROWSER_SYNC_RELOAD_DELAY);
//     });
// });


// gulp.task('browser-sync', ['nodemon'], function () {

//   // for more browser-sync config options: http://www.browsersync.io/docs/options/
//   browserSync({

//     // informs browser-sync to proxy our expressjs app which would run at the following location
//     proxy: 'http://localhost:8000',

//     // informs browser-sync to use the following port for the proxied app
//     // notice that the default port is 3000, which would clash with our expressjs
//     port: 4000,

//     // open the proxied app in chrome
//     browser: ['google-chrome']
//   });
// });


// gulp.task('bs-reload', function () {
//   browserSync.reload();
// });






gulp.task('serve', ['nodemon'], function () {
  browserSync.init({
    proxy: 'http://localhost:8000',
    files: ['/public/**/*.*']
  });
});


gulp.task('nodemon', function () {
  return nodemon({
    ignore: ['./client', './public']
  });
});