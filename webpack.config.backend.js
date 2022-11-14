const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const distPath = path.resolve(__dirname, './dist');

module.exports = {
    mode: 'development',
    entry: {
        backend: './src/backend/main.ts'
    },
    devtool: 'source-map',
    output: {
        filename: '[name].bundle.js',
        path: distPath,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    watch: true
};
