const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(js|jsx)$/,
                use: "babel-loader",
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ]
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 200*1024,
                            name: '[name]_[hash:8].[ext]',
                            outputPath: 'img/'
                        }
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name]_[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    }
};