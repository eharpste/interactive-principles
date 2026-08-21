const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const commonPaths = require('./common-paths');

const config = {
    entry: {
        main: ['./src/index.js']
    },
    output: {
        filename: '[name].js',
        path: commonPaths.outputPath,
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]'
                },
                exclude: /node_modules/
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new MiniCssExtractPlugin({ filename: '[name].css' }),
        new HtmlPlugin({
            filename: 'index.html',
            template: commonPaths.template,
            favicon: commonPaths.favicon,
            inject: true
        })
    ]
};

module.exports = config;
