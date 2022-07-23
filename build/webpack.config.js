const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
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
// 如果写一些组件库等三方包，使用如下配置
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
  mode: 'development',//production
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: './src_tree/index.js',
  },
  devServer: {
    contentBase: './dist',
    open: true,
    port: '8098',
    hot: true,
    hotOnly: true,
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]', // placeholder 占位符
            outputPath: 'images/',
            limit: 10000, // 文件大小小于10000，打成Base64
          },
        },
      },
      {
        test: /\.(eot|ttf|svg|woff)$/,
        use: {
          loader: 'file-loader',
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, //通过import引入的scss文件，也会依次从下到上执行 loader流程
            },
          },
          'sass-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new CleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
  ],
  // optimization:{
  //   usedExports:true
  // },
  output: {
    publicPath: '/', //CDN使用
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
}
