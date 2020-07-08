const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack')
//业务代码(babelrc里面打包的方案是库的形式)
 //options:{
          // presets: [['@babel/preset-env',{
          //   targets: {
          //     "chrome": "67",
          //   },
          //   useBuiltIns:'usage'
          // }]]
       // }

      //  {
      //   "plugins":[[
      //   "@babel/plugin-transform-runtime",
      //   {
      //     "corejs": 2,
      //     "helpers": true,
      //     "regenerator": true,
      //     "useESModules": false
      //   }
      // ]]
      // }      
module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: './src_tree/index.js'
  },
  devServer: {
    contentBase: './dist',
    open: true,
    port: '8098',
    hot: true,
    hotOnly: true
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
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src_tree/index.html'
    }),
    new CleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization:{
    usedExports:true
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
}