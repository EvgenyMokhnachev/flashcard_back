const path = require('path');
const nodeExternals = require('webpack-node-externals');
const distPath = path.resolve(__dirname, './dist');

module.exports = {
  mode: 'development',
  target: 'node',
  externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  entry: {
    backend: './src/main/main.ts'
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
              configFile: "/app/tsconfig.json"
            }
          }
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      // '@frontend': path.resolve(__dirname, '../../../src/frontend'),
      // '@components': path.resolve(__dirname, '../../../src/frontend/components'),
      // '@main': path.resolve(__dirname, '../../../src/main'),
    },
  },
  watch: true,
};
