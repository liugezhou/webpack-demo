const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
  entry: {
    main: './src_react/index.js'
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
        loader: 'babel-loader'
        // options:{
        //   presets: [['@babel/preset-env',{
        //     targets: {
        //       "chrome": "67",
        //     },
        //     useBuiltIns:'usage'
        //   }]]
          // "plugins": [
          //   [
          //     "@babel/plugin-transform-runtime",
          //     {
          //       "absoluteRuntime": false,
          //       "corejs": 2,
          //       "helpers": true,
          //       "regenerator": true,
          //       "version": "7.0.0-beta.0"
          //     }
          //   ]
          // ]
        // }
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
    runtimeChunk:{
      name:'runtime'
    },
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