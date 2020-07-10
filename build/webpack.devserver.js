const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path =require('path');
module.exports = {
  mode:'development',  
  entry:'./src_devserver/index.js',
  devtool:'cheap-module-eval-source-map',
  devServer:{
    contentBase:'./dist',
    open:true,
    port:8000,
    hot:true,
    hotOnly:true,
    proxy:{
      '/react/api':{
        target:'http://www.dell-lee.com',
        secure:false,  //可以对https生效
        pathRewrite:{
          'header.json':'demo.json'
        },
        changeOrigin: true , //可以突破origin，支持访问
        headers: {
          host:'www.liugezhou.online'
        }
      }
    }
  },
  module:{
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
      },
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
  plugins:[
    new HtmlWebpackPlugin({
      template:'index.html'
    }),
    new CleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin()
  ],
  output:{
    filename:'[name].js',
    path:path.resolve(__dirname,'dist')
  }
}
