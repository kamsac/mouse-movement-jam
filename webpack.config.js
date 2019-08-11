const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const outputPath = path.resolve(__dirname, 'dist');

module.exports = {
    target: 'web',
    mode: "development",
    devtool: 'inline-source-map',
    entry: [
        path.resolve(__dirname, 'src', 'main.ts'),
    ],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
            },
            {
                test: /\.(wav|ogg|mp3)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: true,
                        },
                    },
                ],
            },
        ],
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Elkronez - Mouse Movement Jam',
            template: path.resolve(__dirname, 'src', 'index.html')
        }),
    ],
};