const { paths } = require('../config');
const { gulp, argv } = require('../plugins/tools');
const webpack = require('webpack');
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
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: [
                            {
                                loader: 'babel-loader'
                            }
                        ],
                        exclude: '/node_modules/'
                    },
                ],
            },
            optimization: {
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        vendors: {
                            test: /[\\/]node_modules[\\/]/,
                            name(module) {
                                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                                return `plugin.${packageName.replace('@', '')}`;
                            }
                        }
                    }
                }
            },
            plugins: [
                new webpack.ProgressPlugin(),
                new webpack.ProvidePlugin({
                    $: 'jquery',
                    jQuery: 'jquery',
                })
            ]
        }, webpack))
        .pipe(gulp.dest(paths.dist));
}

module.exports = () => scripts;