let isDev = true;

const {
  watch, series, src, dest, parallel,
} = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const groupMedia = require('gulp-group-css-media-queries');
const cleanCss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config');

const buildFolder = (isDev ? 'dev' : 'build');
const path = {
  src: {
    html: 'src/*.html',
    scss: 'src/assets/scss/main.scss',
    js: 'src/js/index.js',
    img: 'src/assets/img/**/*.{jpg,png,svg,gif,ico,webp}',
    fonts: 'src/assets/fonts/*.{woff,woff2}',
  },
  watch: {
    html: 'src/**/*.html',
    scss: 'src/assets/scss/**/*.scss',
    js: 'src/**/*.js',
    img: 'src/assets/img/**/*.{jpg,png,svg,gif,ico,webp}',
  },
  dev: {
    html: './dev/',
    css: './dev/css/',
    js: './dev/js/',
    img: './dev/img/',
    fonts: './dev/fonts/',
  },
  build: {
    html: './build/',
    css: './build/css/',
    js: './build/js/',
    img: './build/img/',
    fonts: './build/fonts/',
  },
  clean: './build/',
};

const html = () => src(path.src.html)
  .pipe(dest(isDev ? path.dev.html : path.build.html))
  .pipe(browserSync.stream());

const scss = () => src(path.src.scss, { sourcemaps: isDev })
  .pipe(sass({ outputStyle: 'expanded' }))
  .pipe(groupMedia())
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 3 versions'],
    cascade: true,
    grid: true,
  }))
  .pipe(rename({ basename: 'style' }))
  .pipe(cleanCss())
  .pipe(rename({ suffix: '.min' }))
  .pipe(dest(isDev ? path.dev.css : path.build.css, { sourcemaps: '.' }))
  .pipe(browserSync.stream());

const js = () => src(path.src.js)
  .pipe(webpack({
    ...webpackConfig,
    mode: !isDev ? 'development' : 'production',
    devtool: isDev ? 'source-map' : false,
  }))
  .pipe(dest(isDev ? path.dev.js : path.build.js))
  .pipe(browserSync.stream());

const images = () => src(path.src.img)
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{ removeViewBox: false }],
    interlaced: true,
    optimizationLevel: 4, // 0 to 7
  }))
  .pipe(dest(isDev ? path.dev.img : path.build.img))
  .pipe(browserSync.stream());

const fonts = () => src(path.src.fonts)
  .pipe(dest(isDev ? path.dev.fonts : path.build.fonts));

const setBuildMode = (done) => {
  isDev = false;
  done();
};

const clean = () => del(path.clean);

const server = () => {
  browserSync.init({
    server: { baseDir: `./${buildFolder}/` },
    port: 3000,
    notify: false,
    online: true,
  });
};

const watchFiles = () => {
  watch([path.watch.html], html);
  watch([path.watch.scss], scss);
  watch([path.watch.js], js);
  watch([path.watch.img], images);
};

const build = series(setBuildMode, clean, parallel(html, scss, js, images, fonts));
const dev = parallel(parallel(html, scss, js, images, fonts), watchFiles, server);

exports.html = html;
exports.scss = scss;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.build = build;
exports.dev = dev;
exports.default = dev;
