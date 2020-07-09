const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.js');

const devConfig = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  module:{
    rules:[
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          'sass-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
    ]
  },
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
    usedExports:true  //tree-shading使用
  },
}
module.exports = merge(baseConfig, devConfig);
