const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: ['./js/index.js'],
    output: {
        filename: "./bundle.js"
    },
    devtool: 'sourse-map',
    module:{
        rules:[
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'js/js'),
                use:{
                    loader: 'babel-loader',
                    options:{
                        presets: 'env'
                    }
                }
                
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        noInfo: false,
        overlay: true,
        host: '0.0.0.0',
        port: 8080

    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "index.html",
            filename: "index.html",
            title: 'Главная страница',
            chunks: ["main"]
        })
    ]

}