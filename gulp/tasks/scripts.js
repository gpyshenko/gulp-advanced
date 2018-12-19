const { paths } = require('../config');
const { gulp, argv } = require('../plugins/tools');
const webpackStream = require('webpack-stream');

function scripts() {
    return gulp.src([`${paths.src}/scripts/*.js`, `!${paths.src}/vendors/**/*.js`])
        .pipe(webpackStream({
            mode: argv.dev ? 'development' : 'production',
            entry: {
                index: `${paths.src}/scripts/main.js`,
                about: `${paths.src}/scripts/about.js`,
            },
            output: {
                filename: 'scripts/[name].js'
            }
        }))
        .pipe(gulp.dest(paths.dist));
}

module.exports = () => scripts;