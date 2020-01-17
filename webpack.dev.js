const baseConfig = require('./webpack.base.js');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const host = require('./build/ip')();

console.log('========>host:', host)

module.exports = merge(baseConfig, {
    devtool: 'cheap-module-eval-source-map',
    entry: './example/index.js',
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'white-board.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'example/index.html',
            hash: true,
            filename: 'index.html'
        }),
    ],
    devServer: {
        host: host || 'localhost',
        port: 3009,
        progress: true,
        open: true,
        compress: true,
        contentBase: path.resolve(__dirname, 'dist')
    },
    mode: 'development'
});