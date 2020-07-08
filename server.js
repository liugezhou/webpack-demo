const express = require('express');
const webpack = require('webpack');
const webpackDevMidleware = require("webpack-dev-middleware")
const config = require('./webpack.config.js')
const compiler = webpack(config);

const app = express();
app.use(webpackDevMidleware(compiler,{
  publicPath: config.output.publicPath
}))

app.listen(3000, () => {
  console.log('server is running')
})