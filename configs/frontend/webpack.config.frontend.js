const {VueLoaderPlugin} = require("vue-loader");

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const distPath = path.resolve(__dirname, './../../dist');

module.exports = {
  mode: 'development',
  entry: {
    frontend: './src/frontend/main.ts',
  },
  devtool: 'source-map',
  output: {
    filename: '[name].bundle.js',
    path: distPath,
  },
  module: {
    rules: [
      {
        test: /\.vue?$/,
        loader: 'vue-loader',
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: true,
              configFile: "/app/configs/frontend/tsconfig.frontend.json"
            }
          }
        ],
        exclude: /node_modules/,
      },

    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.vue', '.vuex'],
    alias: {
      '@frontend': path.resolve(__dirname, '../../../src/frontend'),
      '@components': path.resolve(__dirname, '../../../src/frontend/components'),
      '@main': path.resolve(__dirname, '../../../src/main'),
    },
  },
  watch: true,
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['frontend']
    }),
    new VueLoaderPlugin()
  ]
};
