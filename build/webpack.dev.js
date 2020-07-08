const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.js');

const devConfig = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: './dist',
    open: true,
    port: '8098',
    hot: true,
    // hotOnly: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization:{
    usedExports:true
  },
}
module.exports = merge(baseConfig, devConfig);
