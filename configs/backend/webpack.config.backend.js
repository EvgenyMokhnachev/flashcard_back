const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const distPath = path.resolve(__dirname, './../../dist');

module.exports = {
  mode: 'development',
  target: 'node',
  externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
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
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: "/app/configs/backend/tsconfig.backend.json"
            }
          }
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  watch: true,
};
