const { paths } = require('../config');
const { gulp, argv } = require('../plugins/tools');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

function scripts() {
    return gulp.src([`${paths.src}/scripts/*.js`, `!${paths.src}/vendors/**/*.js`])
        .pipe(webpackStream({
            mode: argv.dev ? 'development' : 'production',
            cache: argv.dev,
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
                        test: /\.css$/,
                        use: [
                            {
                                loader: MiniCssExtractPlugin.loader,
                                options: {
                                    publicPath: '../../'
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    url: (argv.prod),
                                    sourceMap: (argv.dev)
                                }
                            }
                        ]
                    },
                    {
                        test: /\.js$/,
                        use: [
                            {
                                loader: 'babel-loader'
                            }
                        ],
                        exclude: '/node_modules/'
                    },
                    {
                        test: /\.(svg|eot|ttf|woff|woff2)$/,
                        use: {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'assets/vendors/'
                            }
                        }
                    },
                    {
                        test: /\.(jpe?g|png|gif|svg)$/,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '[name].[ext]',
                                    outputPath: 'assets/vendors/'
                                }
                            },
                            {loader: 'img-loader'}
                        ]
                    }
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
                                return `vendors/${packageName.replace('@', '')}`;
                            }
                        }
                    }
                }
            },
            plugins: [
                new webpack.ProgressPlugin(),
                new MiniCssExtractPlugin({
                    filename: 'styles/[name].css'
                }),
                new webpack.ProvidePlugin({
                    $: 'jquery',
                    jQuery: 'jquery',
                })
            ]
        }, webpack))
        .pipe(gulp.dest(paths.dist));
}

module.exports = () => scripts;