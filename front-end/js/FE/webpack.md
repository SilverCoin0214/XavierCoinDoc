## 1. 说说你对webpack的理解？ 解决了什么问题？

### 是什么
webpack是一个用于现代JS应用程序的静态模块打包工具

- 静态模块
	- 这里的静态模块指的是在开发阶段，可以被webpack直接引用的资源
	- 当webpack处理应用程序时，它会再内部构建一个依赖图，此依赖图对应映射到项目所需的每个模块，并生成一个或多个bundle
### webpack的能力

- 编译代码的能力，提高效率，解决浏览器兼容问题
- 模块整合能力，提高性能，可维护性， 解决浏览器频繁请求文件的问题
- 万物皆可模块的能力， 项目维护性增强，支持不同类型的前端模块类型，统一的模块化方案

## 2. webpack的热更新是如何做到的？ 原理是什么？

### 是什么
HMR可以理解为热模块替换，指应用程序运行过程中，替换，添加，删除模块，而无需重新刷新整个应用。


### 3. webpack的构建流程？

### 运行流程
webpakc的运行流程是一个串行过程，它的工作流程就是将各个插件串联起来。

在运行过程中会广播事件，插件只需要监听它所关心的事件， 就能加入到这条webpack机制中，去改变webpack的运作，使得整个系统扩展良好。

从启动到结束会一次执行三大步骤
- 初始化流程： 从配置文件和shell语句读取与合并参数，并初始化需要使用的插件和配置插件等执行环境所需要的参数。
	- webpack将webpack.config.js中各项配置拷贝到options对象中，并加载用户配置的plugins
	- 完成后则开始初始化compiler编译对象，该对象掌控着webpack声明周期，不执行具体任务，只进行一些调度任务
- 编译构建流程： 从entry发出，针对每个module串行调用对应的Loader去翻译文件内容，在找到该module依赖的module， 递归地进行编译处理。
	- 初始化后会调用compiler的run来真正启动webpack编译构建流程
		- compile 编译
		- make 从入口点分析模块及其依赖模块，创建这些模块对象
		- build-module 构建模块
		- seal 封装构建结果
		- emit 把各个chunk输出到结果文件
- 输出流程： 对编译后的module组合成chunk, 把chunk转换成文件， 输出到文件系统。

## 4. 说说webpack proxy工作原理？ 为什么能解决跨域？

### 是什么？
webpack proxy是webpack提供的代理服务。
基本行为就是接收客户端发送的请求后转发给其他服务器。
其目的是为了便于开发者在开发模式下解决跨域问题(浏览器安全策略限制)
想要代理需要一个中间服务器。

### 工作原理
proxy工作原理实际上就是利用 http-proxy-middleware这个http代理中间件，实现请求转发给其他服务器

## 5. 说说webpack常见的loader？ 解决了什么问题？

loader用于对模块的源代码进行转换，在import或加载模块时预处理文件。

### 配置方式

在module.rules属性中：
- rules是一个数组的形式，因此可以配置多个loader
- 每一个loader对应一个对象的形式，对象属性test为匹配规则，一般为正则表达式
- 属性use针对匹配到的文件类型， 调用对应的loader进行处理

### 特性
- loader可以是同步的，也可以是异步的
- loaeder运行在node.js中，并且能够执行任何操作
- 除了常见的package.json的main来将一个Npm模块导出为loader, 还可以再module.rules种使用loader字段直接引用一个模块
- plugins可以为loader带来更多特性
- loader能够产生额外的任意文件

## 6. 说说webpack中常见的plugin？ 解决了什么问题？

### 是什么？

plugin是一个计算机程序，它与主应用程序交互，以提供特定的功能。
plugin赋予其灵活的功能，例如打包优化，资源管理，环境变量注入等，他们会运行在webpack的不同阶段， 贯穿了webpack整个编译周期，目的在于解决loader无法实现的其他事。

### 配置方式
一般情况，通过配置文件导出的plugins属性传入new 实例对象。


## 7. 说说loader和plugin的区别？ 编写loader，plugin的思路？

### 区别


## 8. 如何提高webpack的构建速度？

## 9. 如何借助webpack来优化前端性能？

## 10. 与webpack类似的工具还有那些？ 区别？