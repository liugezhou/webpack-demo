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
> + Tree Shaking在webpack2.0之后引入：在math.js中有两个方法add 和minu，在index中只调用add方法，去打包的时候，会将math中的两个方法均打包，这样做是没有必要，且会使得打包文件变大，Tree Shaking就是为了解决这个问题的。     
> + Tree Shaking只支持ES Module(即import)。 
> + mode为development,默认没有Tree Shaking功能。配置的话需要在配置文件中添加 `optimization:{usedExports:true},` ，并且如果直接引入第三方资源，如果也不想做Tree Shaking，需要在package.json中配置（比如业务代码中使用了polyfill，添加： "sideEffects":["@babel/polyfill"],以忽略Tree Shaking对其作用）   
> + 在我们math这个例子中，并未用到polyfill  所以可以直接在package.json中配置： "sideEffects":false  
>
