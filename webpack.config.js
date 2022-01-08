const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
    context: path.resolve(__dirname, 'app'),
    entry: './js/creator.js',
    module: {
        rules: [
            { test: /\.css$/i, use: [ 'style-loader', 'css-loader' ] },
            { test: /\.js$/i, use: 'babel-loader' },
            { test: /\.(png|svg)$/, use: { loader: 'url-loader' } }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'static'),
        filename: 'js/creator.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './creator.html'
        }),
        new CleanWebpackPlugin()
    ],
    mode: 'development'
}