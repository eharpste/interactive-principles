const webpack = require('webpack');
const commonPaths = require('./common-paths');

const config = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: commonPaths.outputPath
        },
        compress: true,
        hot: true,
        port: 9000,
        client: {
            overlay: {
                errors: true,
                warnings: false,
                runtimeErrors: true
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ]
};

module.exports = config;
