const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
  entry: {
    main: './src_split/index.js',
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
            limit: 10000,
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
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
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
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../'),
    }),
  ],
  optimization: {
    runtimeChunk: {
      name: 'runtime',
    },
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,// 只要用了1次的引入就开启代码分割
      maxAsyncRequests: 5,
      maxInitialRequests: 3, // 首页、入口文件做代码分割最多3个
      automaticNameDelimiter: '~', // 文件生产连割符
      name: true,
      cacheGroups: { // 分割出来的代码到底要分割在哪里去，在这里设置
        vendors: {
          test: /[\\.]node_modules[\\/]/,
          priority: -10, // 优先级，如果都符合这俩规则，此值大的就打包到这里
          filename: 'vendors.js',
        },
        default: {
          priority: -20,
          reuseExistingChunk: true,
          filename:'common.js'
        },
      },
    },
  },
  output: {
    publicPath: '/', //静态资源CDN使用
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, '../dist'),
  },
}
