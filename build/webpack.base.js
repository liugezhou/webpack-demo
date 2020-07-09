const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
  entry: {
    main: './src_pwa/index.js'
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            // placeholder 占位符
            name: '[name].[ext]',
            outputPath: 'images/',
            limit: 10000
          }
        }
      },
      {
        test: /\.(eot|ttf|svg|woff)$/,
        use: {
          loader: 'file-loader'
        }
      },
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        use:[{
          loader:'babel-loader'
        }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new CleanWebpackPlugin(['dist'],{
      root: path.resolve(__dirname, '../')
    })
  ],
  optimization:{
    usedExports:true,  //tree-shading使用
    splitChunks: {
      chunks: 'all'
    }
  },
  output: {
    filename: '[name].js',
    chunkFilename:'[name].chunk.js',
    path: path.resolve(__dirname, '../dist')
  },
}