### 目录结构

```
|-- webpack-demo
  |-- .babelrc ------------------------- babel配置
  |-- .eslintrc.js
  |-- .gitignore ----------------------- 忽略提交文件
  |-- index.html ----------------------- htmlWebpackPlugin使用
  |-- package-lock.json ---------------- 版本固定
  |-- package.json --------------------- 项目配置、依赖
  |-- postcss.config.js ----------------- postcss配置，依赖autoprefixer
  |-- readme.md ------------------------ 说明文档、知识点总结
  |-- server.js ------------------------- 手写devServer
  |-- build
  |   |-- webpack.base.js
  |   |-- webpack.config.js --------------- 只是server.js使用的配置文件
  |   |-- webpack.dev.js ----------------  本地项目启动依赖配置
  |   |-- webpack.devserver.js ----------- devServer配置文件测试(未引用)
  |   |-- webpack.prod.js  --------------- 本地项目打包依赖配置--生产打包配置不一致
  |-- src -------------------------------- 测试打包png scss font(loader使用)
  |   |-- createAvatar.js
  |   |-- img.png
  |   |-- index.js
  |   |-- index.scss
  |-- src_HMR
  |   |-- counter.js
  |   |-- index.js
  |   |-- number.js
  |   |-- style.css
  |-- src_babel
  |   |-- index.js
  |-- src_code_splitting
  |   |-- index.js
  |-- src_devserver
  |   |-- home.js
  |   |-- index.js
  |   |-- list.js
  |-- src_lazy
  |   |-- index.js
  |-- src_pwa
  |   |-- index.js
  |-- src_react
  |   |-- index.js
  |-- src_shimming
  |   |-- index.js
  |   |-- jquery.ui.js
  |-- src_splitChunks
  |   |-- index.js
  |   |-- test.js
  |-- src_tree
      |-- index.js
      |-- math.js
```

### 初识 webpack

- webpack is a module bundler.
- webpack 核心定义是一个模块打包工具。
- webpack module：ES Module、CommonJS、CMD、AMD

<!--more-->

### 搭建 webpack 环境

- webpack 本质上是由 node 实现的。
- 不推荐全局安装 webpack
- 查看所有的 webpack 历史版本：`npm view webpack versions`
- 查看最新 webpack 版本：`npm view webpack version `
- 本地项目安装完成后，查看 webpack 的版本：`npx webpack -v`
- 假如本地全局安装了 webpack，想看 webpack 安装目录：`npm ls webpack -g`

### webpack 的配置

- mode:production(代码压缩),development(代码未压缩)
- entry:打包进入文件
- output: 打包输出路径
- 以某文件为配置文件打包：npx webpack --config webpackConfig.js
- loader 是什么：打包方案(对于特定文件的打包处理:比如 file-loader 可以对图片、字体等静态资源文件进行打包) ,loader 的执行顺序是由下往上，由左至右。
- 常用文件 loader：file-loader、url-loader
- 常用样式 loader：postcss-loader(autoprefixer)、sass-loader、css-loader、style-loader
- module:一些 loader 规则（比如使用 file-loader 的时候，想让图片的打包名字不改变，可以在 module 的 rules 中配置 use 属性的 options 属性）
- plugins: 可以在 webpack 运行到某个时刻的时候，帮你做一些事情 类似与 vue 中的生命周期函数。
  > - html-webpack-plugin:会在打包结束后自动生成一个 html 文件，并把打包生成的 js 自动引入到这个 html 文件中。
  > - clean-webpack-plugin:打包生成 dist 目录下的覆盖(1.0 版本可以正常打包，3.0 报错)。

### 打包出的资源 CDN

打包出的资源 js,css 等一般为本地静态文件，但我们需要将这些文件放到 CDN 中，然后在打包出的 index.html 引用，我们可以这么做：

- 在 output 中配置，publicPath:'https://cdn.com'

### sourceMap 的配置

- 项目打包后，如果关闭 sourceMap 的配置，在浏览器打开项目后，看到的 js 代码为打包后的代码，不利于查找代码错误。
- sourceMap 是一个映射关系，他可以知道在 dist 打包后的 main.js 错误的代码对应在未经打包的代码的位置。
- 配置项为：
  > - devtool:'source-map'---会在 dist 目录下生成一个.map 的映射文件。
  > - 如果为'inline-source-map'，则不会生成.map 文件，直接在原 main.js 文见中添加注释以映射(位置在底部)。
  > - 如果为'cheap-inline-source-map' :与 inline 不同，只告诉是哪行代码出错，效率会高一些。
  > - 如果为"cheap-module-source-map':不管是业务代码，但是依赖的第三方模块，都会显示出出错的地方。
  > - eval 是打包效率最高的方式。  
  >   如果是开发环境，建议使用“cheap-module-eval-source-map'这种方式。如果是生产环境，一般不用设置 devtool 的配置。如果要配置，推荐使用"cheap-module-source-map"。

### 使用 WebpackDevServer 提升开发效率

需要依赖的包为：webpack-dev-devserver -D
配置项说明：

```
devServer{
 contentBase:'./dist',    // 要监听的文件目录
 open:true,               // 自动打开浏览器窗口
 port:8000,               // 设置监听端口
 hot:true,                // 开启热更新
 proxy:{},                // 代理设置
}
```

要实现的效果是修改了一个 index.js 文件中的代码，可以不用重新打包，直接去运行 index.html 的文件。要实现这种效果有三种方法：

1. 在 package.json 文件中给 script 命令加一个 --watch 的参数。当加入 watch 参数后，会监听文件，如果源文件代码修改，会实时的更新打包。
2. webpack-dev-server（webpack 不自带，需要安装的）:第一次运行脚本的时候，自动打包、打开浏览器、热更新等功能。此外隐藏的一个功能是，webpack-dev-server 会对我们 src 下的文件进行打包，但是没有 dist 目录，是因为将 dist 打包保存至电脑内存。
3. 在 node 中直接使用 webpack：通过 express 与 webpack-dev-middleware 手写一个 server.js。

### [HMR] hot Module Replacement(热模块替换)

场景：js 动作添加一些模块后，如果修改 css 文件，webpack 会将之前的行为给删除，HMR 就是解决只修改 css 样式，但是不更改行为。

- 需要在 devServer 中配置 hot 和 hotOnly
- 测试环境下需要在 Plugin 中添加热更新的操作：new webpack.HotModuleReplacementPlugin()

- 本质上实现热更新，是因为在代码中设置了如下配置

```
if(module.hot){
  module.hot.accept('./some.js',(){
    // 一些document或其他操作
  })
}
```

- CSS、Vue 之所以可以直接热更新就是因为，css-loader、vue-loader 中写入了上方的代码逻辑(或者 babel-presets)。

### 使用 Babel 处理 ES6 语法

- 安装第三方依赖：'babel-loader'、'@babel/core'：babel-loader 只是 webpack 与 babel 的一个沟通桥梁，并不会将 ES6 代码转化为 ES5 代码。
- 继续安装@babel/preset-env，用于将 ES6 代码转为 ES5 代码。
- 配置 webpack.config.js。

```
 {
    test: /\.js$/,
    exclude: /node_modules/,
    use:[{
      loader:'babel-loader'
    },
    ],
    options:{
      presets:["@babel/preset-env"]
    }
  }
```
这个时候就可以将ES6代码转为ES5了，但是只是做到这里还不够，比如转为ES5代码的map等可能在低版本浏览器还是不支持。  

- 为了解决低版本依旧不支持哪些代码，继续安装@babel/polyfill(对低版本的一个完善)。 
- 使用的时候直接在全局引入即可:import '@babel/polyfill'   
- 这样存在一个问题，打出的包非常的大，然后解决之：直接加个配置useBuiltIns：usage  
它的含义是当我们在做polyfill填充的时候，加一些低版本不存在的特性的时候，不会把全部加载，只是根据业务代码进行加载。  

```{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options:{
      presets: [['@babel/preset-env',{
        targets: {
          "chrome": "67",
        },
        useBuiltIns:'usage'
      }]]
    }
  }
```
**tips:** presets中@babel/preset-env中还可以配置target属性，指定最低版本浏览器,以上代码在webpack-config.js中配置演示。   

以上为一种babel的配置，代码中如果只写业务代码就够了。 
但并不是所有都适用，比如在开发一些三方类库、组件库的时候、或者一个模块的时候，polyfill注入会污染全局环境。  
而plugin-transform-runtime会以闭包的形式引入变量，不会污染全局变量。    
接下来介绍另一种babel的配置(不用babel-polyfill的方式)
1. 安装@babel/plugin-transform-runtime 【】 
2. 安装 @babel/runtime  
3. 将上面options内容清空，替换为： 
```
"plugins": [
  [
    "@babel/plugin-transform-runtime",
    {
      "absoluteRuntime": false,
      "corejs": 2,
      "helpers": true,
      "regenerator": true,
      "version": "7.0.0-beta.0"
    }
  ]
]
```
4. 由于有关babel的配置项也特别多，于是可以直接在根目录下新建 .babelrc文件，将以上配置内容写入到该文件中： 
5. 由于上述文件cordjs设置为了2，所以还需要安装`@babel/runtime-corejs2`这个包。  


### 配置React代码的打包
- 在babel官网--文档--预设中有 @babel/preset-react这个选项   
- 安装@babel/preset-react 
- 在.babelrc中配置  
```
{
  "presets": [
    ["@babel/preset-env",{
      "targets": {
        "chrome": "67"
      },
      "useBuiltIns":"usage"
    }],
    ["@babel/preset-react"]
  ]
}
```

### Tree Shaking

> - Tree Shaking 在 webpack2.0 之后引入。
> - 在 math.js 这个模块中有两个方法 add 和 minu，在 index 中只调用 add 方法，去打包的时候，会将 math 中的两个方法均打包，这样做是没有必要，且会使得打包文件变大，Tree Shaking 就是为了解决这个问题的。
> - Tree Shaking 只支持 ES Module(即 import 这种模块引入，require 这种的不支持)。

> mode 为 development 环境：
>
> - 默认没有 Tree Shaking 功能。配置的话需要在配置文件中添加 `optimization:{usedExports:true},` ，并且如果直接引入第三方资源，如果也不想做 Tree Shaking，需要在 package.json 中配置（比如业务代码中使用了 polyfill，添加： "sideEffects":["@babel/polyfill"],以忽略 Tree Shaking 对其作用）
> - 在我们 math 这个例子中，并未用到 polyfill , 我们继续在 package.json 中配置： "sideEffects":false
> - 这个时候我们用 webpack 打包，发现打包文件中，minu 这个方法也被打包保留了下来，但是文件中有提示，告知我们只要 add 方法使用了。之所以有代码的保留是因为在开发环境下我们会调试代码，为了使得行行对应。

> mode 为 production 环境时：
>
> - Tree-Shaking 才算真正生效。
> - 在 production 环境下，Tree-Shaking 默认已经配置好了，在 webpack 的配置文件下不需要对`optimization`配置。
> - 但是仍然需要对 package.json 中的 sideEffects 进行配置。
> - 使用 webpack 打包会发现生成一个.map 的映射文件，且打包文件被压缩，注释去掉、minu 有关的代码也剔除掉了。

### Development 和 Production 模式的区分打包

> 通过前面的学习，我们知道在开发环境与生产环境下，打包方式是有区别。
> 为了提高在不同开发模式下进行打包的效率，我们分别新建两个文件:webpack.dev.js 和 webpack.prod.js。这两个文件分别代码不同环境下的 webpack 配置。  
> 然后在 package.json 文件中的 script 标签页配置两个命令即可：  
> 'dev':'webpack-dev-server --config webpack-dev.js'  
> 'build':'webpack --config webpack.prod.js'

> 到这里我们又发现一个问题，dev 与 prod 的配置文件有特别多相同的代码，我们继续优化：  
> 根目录下新建 webpack.base.js,将 dev 与 prod 相同的代码摘出来放到 base 中去。  
> 这个时候分别将 dev/pro 的文件与 base 文件进行合并输出配置：需要安装第三方模块：`webpack-merge` (此文默认安装的时候最新版本是 5.0.8,使用 merge 报错，然后回退使用 4.2.2 版本)  
> 最后分别在 dev 和 prod 中引入 webpack-merge,通过`module.exports = merge(baseConfig, fileConfig)`即可。

### webpack 和 Code Splitting(代码分割)

> 代码分割与 webpack 无关。
>
> - 这里的代码分割是指对代码进行分割，提高代码执行效率与性能。

> Demo:
>
> - 安装第三方包：lodash(提供了一些工具方法)。
> - 比如通过 entry，将 lodash 打包成一个文件，业务代码打成一个文件。

> webpack4 可以自动的帮我们做代码分割：
>
> - 第一种同步代码：在 webpack.base.js 中配置 optimization:{splitChunks:{chunks:'all'}},此时在开发环境下打包，会看到有一个新的打包文件：vendors~main.js.
> - 第二种异步代码：异步加载第三方资源(import 异步引入)，无需做任何配置，webpack 会自动帮我们进行代码的分割。

### Lazy Loading 懒加载，Chunk 是什么？

> 懒加载是通过 import 异步加载一个模块，在执行的时候，再去引入。  
> 路由懒加载等提升页面加载效率。  
> 业务代码引入第三方资源的懒加载可以通过 async、await。

> chunk 指的是整个项目完成打包后，dist 下面有几个 js 文件就是指几个 chunk。

### CSS 文件的代码分割

> webpack 配置文件中的 output 有两个属性：fileName 和 chunkFilename，这两个的区别是：
>
> CSS 文件代码分割要使用在生产环境中。  
> 需要安装`mini-css-extract-plugin`插件。
> 使用`optimize-css-assets-webpack-plugin`这个插件可以对代码进行合并和压缩。

### shimming

> 代码或者打包过程的兼容性问题。
>
> webpack 自带一个 webpack.procidePlugin({})插件--垫片。
>
> 如果想让每一个 js 文件的 this 指向 window，安装`imports-loader`。  
> 对 webpack.base.js 做一些配置。

### Library 打包

> 自己发布一个 npm 包，在配置好自己的项目包之后，在 npm 官方注册账号，npm login 登录，npm publish 即可

### Progessive Web Application - PWA

> - 安装第三方插件：workbox-webpack-plugin。
> - 线上打包配置文件：添加 plugin：new WorkboxPlugin.GenerateSW()。
> - 在业务代码中，应该 serverWorker，就可以将页面缓存住了。

### TypaScript 的打包配置

> 总结至：https://github.com/liugezhou/typescript_webpack

### 使用 WebpackDevServer 实现请求转发

> 本节主要是对 webpack 的配置 devServer 属性中的 proxy 做了一个讲解，没啥内容。

### WebpackDevServer 解决单页面应用路由问题

> devServer:historyApiFallback: true

### Eslint 在 Webpack 中的配置

> - npm i eslint -D
> - npx eslint --init
> - npm i babel-eslint -D

### 提升 Webpack 打包速度的方法

> 1. 跟上技术的迭代：Npde、Npm、Yarn
> 2. 在尽可能少的模块上应用 Loader (合理使用 exclude 和 include)
> 3. Plugin 尽可能精简少用并确保可靠
> 4. resolve 参数合理配置(如果想引入默认为 js 或者 jsx 的文件，在 webpack 配置文件中加`resolve:{extensions:['.js','jsx']}`)

### 如何编写一个 loader

> 借助 loader 处理引用的文件。  
> [demo 仓库源码](https://github.com/liugezhou/make-loader)

### 如何编写一个 Plugin

> 在打包的某个具体时刻做的操作(比如打包钱清空 dist 目录，打包完成的 html 自动生成等)  
> [demo 仓库源码](https://github.com/liugezhou/make-plugin)

### Bundler 源码编写(模块分析)

> [demo 仓库源码](https://github.com/liugezhou/make-bundle)

### 通过 CreateReactApp 深入学习 Webpack 配置

### 通过 VueCli3 学习 webpack 配置

### [常用的 webpack 插件](https://mp.weixin.qq.com/s/FPENfKo7mObEYcVP0wofRA)

> - HotModuleReplacementPlugin:模块热更新插件(webpack 自带)。
> - html-webpack-plugin:生成 html 文件。
> - clean-webpack-plugin:打包前清理上一次项目生成的 bundle 文件。
> - extract-text-webpack-plugin:将 CSS 生成文件，而非内联。
> - mini-css-extract-plugin:将 CSS 提取为独立的文件的插件。
> - purifycss-webpack:有时候我们 css 写多了或者重复了，这就造成了多余的代码，我们希望在生产环境下去除。
> - optimize-css-assets-webpack-plugin:我们希望减小 css 打包后的体积，可以用到此插件。
> - uglifyjs-webpack-plugin:是 vue-cli 默认使用的压缩代码方式，用来对 js 文件进行压缩，从而减少 js 文件的大小，加速 load 速度。
> - terser-webpack-plugin:Webpack4.0 默认是使用 terser-webpack-plugin 这个压缩插件，在此之前是使用 uglifyjs-webpack-plugin，这两者的区别是后者对 ES6 的压缩不是很友好。
> - webpack.NoEmitOnErrorsPlugin():报错但不退出 webpack 进程。
> - compression-webpack-plugin:所有现代浏览器都支持 gzip 压缩，启用 gzip 压缩可大幅缩减传输资源大小，从而缩短资源下载时间，减少首次白屏时间，提升用户体验。(这个方法还需要后端配置支持)
> - webpack.DefinePlugin:定义一些全局变量，在模块中直接使用这些变量，无需作任何声明。
> - webpack.ProvidePlugin:自动加载模块。
> - copy-webpack-plugin:我们在 public/index.html 中引入了其他的静态资源(js、png、css 等)，在打包的时候 webpack 并不会帮我们拷贝到 dist 目录，因此 copy-webpack-plugin 可以很友好地帮我们做拷贝工作。
