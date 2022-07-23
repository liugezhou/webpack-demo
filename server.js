const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require("webpack-dev-middleware")
const config = require('./webpack.config.js')
// 在node中使用webpack ：webpack传入config进行编译，返回一个编译器
const compiler = webpack(config);

const app = express();
app.use(webpackDevMiddleware(compiler,{
  publicPath: config.output.publicPath
}))

app.listen(3000, () => {
  console.log('server is running')
})