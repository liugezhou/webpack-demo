#### 初识webpack
> + webpack is a module bundler.    
> + webpack核心定义是一个模块打包工具。   
> + webpack module：ES Module、CommonJS、CMD、AMD 

<!--more-->
#### 搭建webpack环境
> +  webpack本质上是由node实现的。 
> + 不推荐全局安装webpack   
> + 查看所有的webpack历史版本：`npm view webpack versions`    
> +  查看最新webpacxk版本：`npm view webpack version `  
> + 本地项目安装完成后，查看webpack的版本：`npx  webpack -v`    
> + 加入本地全局安装了webpack，想看webpack安装目录：`npm ls webpack -g` 

#### webpack的配置
> + mode:production(代码压缩),development(代码未压缩)
> + entry:打包进入文件  
> + output: 打包输出路径  
> + 以某文件为配置文件打包：npx webpack --config webpackconfig.js 
> + loader是什么：打包方案(对于特定文件的打包处理:比如file-loader可以对图片、字体等静态资源文件进行打包) ,loader的执行顺序是由下往上，由左至右。   
> + module:一些loader规则（比如使用file-loader的时候，想让图片的打包名字不改变，可以在module的rules中配置use属性的options属性）   
> + plugins:  
> > + html-webpack-plugin:会在打包结束后自动生成一个html文件，并把打包生成的js自动引入到这个html文件中。 
>> + plugin可以在webpack运行到某个时刻的时候，帮你做一些事情   类似与vue中的生命周期函数。 
>> + clean-webpack-plugin:打包生成dist目录下的覆盖(1.0版本可以正常打包，3.0报错)。

#### sourceMap的配置
> + 项目打包后，如果关闭sourceMap的配置，在浏览器打开项目后，看到的js代码为打包后的代码，不利于查找代码错误。 
> + sourceMap是一个映射关系，他可以知道在dist打包后的main.js错误的代码对应在未经打包的代码的位置。  
> + 配置项为：devtool:'source-map'---会在dist目录下生成一个.map的映射文件。如果为'inline-source-map'，则不会生成.map文件，直接在原main.js文见中添加注释以映射(位置在底部)。如果为''cheap-inline-source-map' :与inline不同，只告诉是哪行代码出错，效率会高一些。如果为"cheap-module-source-map':不管是业务代码，但是依赖的第三方模块，都会显示出出错的地方。eval是打包效率最高的方式。如果是开发环境，建议使用“cheap-module-eval-source-map'这种方式。如果是开发环境，一般不用设置devtool的配置。如果要配置，推荐使用"cheap-module-source-map"。

#### 使用WebpackDevServer提升开发效率
>  要实现的效果是修改了一个index.js文件中的代码，可以不用重新打包，直接去运行index.html的文件。要实现这种效果有三种方法： 
> + 1. 在 package.json文件中给script命令加一个 --watch的参数。当加入watch参数后，会监听文件，如果源文件代码修改，会实时的更新打包。 
> + 2. webpack-dev-server（webpack不自带，需要安装的）:第一次运行脚本的时候，自动打包、打开浏览器、热更新等功能。此外隐藏的一个功能是将dist打包保存至电脑内存。  
> + 3. 在node中直接使用webpack：通过expres与webpack-dev-middleware手写一个server.js。

#### [HMR] hot Module Replacement(热模块替换)
> 场景：js动作添加一些模块后，如果修改css文件，webpack会将之前的行为给删除，HMR就是解决只修改css在，不更改行为的。

#### 使用Babel处理ES6语法
> + 安装第三方依赖：'babel-loader'、'@babel/core'：babel-loader只是webpack与babel的一个沟通桥梁，并不会将ES6代码转化为ES5代码。 
> + 继续安装@babel/preset-env，用于将ES6代码转为ES5代码。 
> + 配置webpack.config.js。 
> + 继续安装@babel/pollyfill(对低版本的一个完善)，使用的时候直接在全局引入即可:import '@babel/polyfill',这样存在一个问题，打出的包非常的大，不爽，然后解决之：在webpack的配置文件中，这么配置：   
```{ 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: 'babel-loader',
        options:{
          presets: [['@babel/preset-env',{
            useBuiltIns:'usage'
          }]]
        }
      }      
```

#### Tree Shaking
> + Tree Shaking在webpack2.0之后引入。  
> + 在math.js这个模块中有两个方法add 和minu，在index中只调用add方法，去打包的时候，会将math中的两个方法均打包，这样做是没有必要，且会使得打包文件变大，Tree Shaking就是为了解决这个问题的。     
> + Tree Shaking只支持ES Module(即import这种模块引入，require这种的不支持)。 

>  mode为development环境：  
> + 默认没有Tree Shaking功能。配置的话需要在配置文件中添加 `optimization:{usedExports:true},` ，并且如果直接引入第三方资源，如果也不想做Tree Shaking，需要在package.json中配置（比如业务代码中使用了polyfill，添加： "sideEffects":["@babel/polyfill"],以忽略Tree Shaking对其作用）   
> + 在我们math这个例子中，并未用到polyfill , 我们继续在package.json中配置： "sideEffects":false   
> + 这个时候我们用webpack打包，发现打包文件中，minu这个方法也被打包保留了下来，但是文件中有提示，告知我们只要add方法使用了。之所以有代码的保留是因为在开发环境下我们会调试代码，为了使得行行对应。  

> mode为production环境时：  
> + Tree-Shaking才算真正生效。  
> + 在production环境下，Tree-Shaking默认已经配置好了，在webpack的配置文件下不需要对`optimization`配置。     
> + 但是仍然需要对package.json中的sideEffects进行配置。   
> +  使用webpack打包会发现生成一个.map的映射文件，且打包文件被压缩，注释去掉、minu有关的代码也剔除掉了。    


#### Development和Production模式的区分打包
>  通过前面的学习，我们知道在开发环境与生产环境下，打包方式是有区别。 
>  为了提高在不同开发模式下进行打包的效率，我们分别新建两个文件:webpack.dev.js和webpack.prod.js。这两个文件分别代码不同环境下的webpack配置。     
> 然后在package.json文件中的script标签页配置两个命令即可：  
> 'dev':'webpack-dev-server --config webpack-dev.js'    
> 'build':'webpack --config webpack.prod.js'    

> 到这里我们又发现一个问题，dev与prod的配置文件有特别多相同的代码，我们继续优化：    
> 根目录下新建webpack.base.js,将dev与prod相同的代码摘出来放到base中去。      
> 这个时候分别将dev/pro的文件与base文件进行合并输出配置：需要安装第三方模块：`webpack-merge` (此文默认安装的时候最新版本是5.0.8,使用merge报错，然后回退使用4.2.2版本)   
> 最后分别在dev和prod中引入webpack-merge,通过`module.exports = merge(baseConfig, fileConfig)`即可。  

#### webpack和Code Splitting(代码分割)
> 代码分割与webpack无关。
> + 这里的代码分割是指对代码进行分割，提高代码执行效率与性能。    

> Demo:
> + 安装第三方包：lodash(提供了一些工具方法)。      
> + 比如通过entry，将lodash打包成一个文件，业务代码打成一个文件。   

> webpack4可以自动的帮我们做代码分割：  
> + 第一种同步代码：在webpack.base.js中配置 optimization:{splitChunks:{chunks:'all'}},此时在开发环境下打包，会看到有一个新的打包文件：vendors~main.js.    
> + 第二种异步代码：异步加载第三方资源(import异步引入)，无需做任何配置，webpack会自动帮我们进行代码的分割。

#### Lazy Loading懒加载，Chunk是什么？
> 懒加载是通过import异步加载一个模块，在执行的时候，再去引入。  
> 路由懒加载等提升页面加载效率。  
> 业务代码引入第三方资源的懒加载可以通过async、await。    

> chunk指的是整个项目完成打包后，dist下面有几个js文件就是指几个chunk。

#### CSS文件的代码分割
> webpack配置文件中的output有两个属性：fileName和chunkFilename，这两个的区别是：  
> 
> CSS文件代码分割要使用在生产环境中。   
> 需要安装`mini-css-extract-plugin`插件。 
> 使用`optimize-css-assets-webpack-plugin`这个插件可以对代码进行合并和压缩。

#### shimming
> 

