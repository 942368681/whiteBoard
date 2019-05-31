const baseConfig = require('./webpack.base.js');
const merge = require('webpack-merge');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

module.exports = merge(baseConfig, {
    entry: './src/white-board.js',
    devtool: 'cheap-module-eval-source-map',
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'white-board.min.js'
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    // 插件
    plugins: [
        new cleanWebpackPlugin()
    ],
    mode: 'production'
});