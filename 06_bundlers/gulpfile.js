const {src, dest, series, watch} = require('gulp');

const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const babel = require("gulp-babel");
const uglify = require('gulp-uglify-es').default;
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();

const clean = () => {
    return del(['dist', 'dev'])
};

const resources = () => {
    return src('src/resources/**')
        .pipe(dest('dist/resources'))
        .pipe(dest('dev/resources'))
};

const styles = () => {
    return src('src/styles/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(dest('dev/styles'))
        .pipe(concat('main.css'))
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(cleanCss({
            level: 2,
        }))
        .pipe(dest('dist/styles'))
        .pipe(browserSync.stream())
};

const htmlMinify = () => {
    return src('src/**/*.html')
        .pipe(dest('dev'))
        .pipe(htmlMin({
            collapseWhitespace: true,
        }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
};

const svgSprites = () => {
    return src('src/img/svg/**/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(dest('dist/img'))
        .pipe(dest('dev/img'))
};

const images = () => {
    return src([
        'src/img/**/*.jpg',
        'src/img/**/*.png',
        'src/img/*.svg',
        'src/img/**/*.jpeg'
    ])
        .pipe(image())
        .pipe(dest('dist/img'))
        .pipe(dest('dev/img'))
};

const scripts = () => {
    return src([
        'src/js/components/**/*.js',
        'src/js/main.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(dest('dev/js'))
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(concat('app.js'))
        .pipe(uglify({
            toplevel: true
        }).on('error', notify.onError()))
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream())
};

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
};

watch('src/**/*.html', htmlMinify);
watch('src/styles/**/*.css', styles);
watch('src/img/svg/**/*.svg', svgSprites);
watch('src/js/**/*.js', scripts);
watch('src/resources/**', resources);

exports.clean = clean;
exports.default = series(clean, resources, htmlMinify, styles, svgSprites, images, scripts, watchFiles);