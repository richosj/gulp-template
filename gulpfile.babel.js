import gulp from "gulp";
import plumber from "gulp-plumber";
import del from "del";
import ws from "gulp-webserver";
import gulpSass from "gulp-sass";
import dartSass from "dart-sass";
import sourcemaps from "gulp-sourcemaps";
import minificss from "gulp-minify-css";
import autoprefixer from "autoprefixer";
import postCss from "gulp-postcss";
import rename from "gulp-rename";
import bro from "gulp-bro";
import minify from "gulp-minify";
import fileInclude from "gulp-file-include";
import cached from "gulp-cached";
import livereload from "gulp-livereload";
import newer from "gulp-newer";

// Define source and destination paths
const src = './src';
const dist = './dist';
const ass = '/assets';

const path_src = {
  html: src + '/html',
  css: src + ass + '/css',
  images: src + ass + '/images',
  js: src + ass + '/js',
  fonts: src + ass + '/fonts' // Add font source path
};

const path_dist = {
  html: dist,
  css: dist + ass + '/css',
  images: dist + ass + '/images',
  js: dist + ass + '/js',
  fonts: dist + ass + '/fonts' // Add font destination path
};

// Error handler
const onErrorHandler = (error) => console.log(error);

// Task to clean dist folder
const clean = () => del([dist], { allowEmpty: true });

// Task to compile HTML files
const html = () => {
  return gulp.src([
    path_src.html + '/**/*.html',
    '!' + path_src.html + '/**/_*',
    '!' + path_src.html + '/**/_*/**/*'
  ])
  .pipe(plumber({ errorHandler: onErrorHandler }))
  .pipe( cached('html') )
  .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
  .pipe(gulp.dest(path_dist.html));
};
const image = () => {
  return gulp.src( path_src.images + '/**/*' )         
  .pipe( newer( path_dist.images ) )                   
  .pipe( gulp.dest( path_dist.images ) );
}

// Task to compile Sass to CSS
const css = () => {
  const sass = gulpSass(dartSass);
  const options = {
    scss: {
      outputStyle: "expanded",
      precision: 8,
      sourceComments: true,
      compiler: dartSass,
    },
    postcss: [autoprefixer({ overrideBrowserslist: 'last 2 versions' })]
  };

  return gulp.src(path_src.css + '/**/*.scss',
    { sourcemaps: true })
    .pipe(plumber({ errorHandler: onErrorHandler }))
    .pipe(sourcemaps.init())
    .pipe(sass(options.scss).on('error', sass.logError))
    .pipe(postCss(options.postcss))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path_dist.css))
    .pipe(minificss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path_dist.css))
};

// Task to compile JavaScript
const js = () => {
  return gulp.src(path_src.js + '/**/*.js')
    .pipe(plumber({ errorHandler: onErrorHandler }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(minify({ ext: { min: '.min.js' }, ignoreFiles: ['-min.js'] }))
    .pipe(gulp.dest(path_dist.js))
};

// Task to move font files
const fonts = () => {
  return gulp.src(path_src.fonts + '/**/*')
    .pipe(cached('fonts')) // Prevents recompiling unchanged files
    .pipe(gulp.dest(path_dist.fonts));
};

// Task to watch for file changes
const watch = () => {
  gulp.watch(path_src.html + "/**/*", html).on('change', livereload.changed);
  gulp.watch(path_src.css + "/**/*", css);
  gulp.watch(path_src.js + "/**/*", js);
  gulp.watch(path_src.fonts + "/**/*", fonts);
};

// Task to start the development server
const webserver = () => {
  return gulp.src(dist)
    .pipe(ws({ livereload: true, open: true }));
};

// Task to build the project
const build = gulp.series([clean, gulp.parallel([html, css, js, fonts, image])]);

// Task to start the development environment
const dev = gulp.series([build, gulp.parallel([webserver, watch])]);

export { build, dev };
