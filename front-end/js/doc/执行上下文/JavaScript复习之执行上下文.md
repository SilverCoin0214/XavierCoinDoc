> Education is what remains after one has forgotten everything he learned in school

## 前言
近期正准备重新复习一遍关于JavaScript相关的一些核心知识, 原本习惯是以思维导图作为归纳总结. 

但后面想想输出可能才是最高形式的总结和再度学习, 很多知识点在阅读和吸收时通常能快速理解, 但实际再对外输出时, 可能就没有那么的精准和通顺. 

以及我一直认为学习之后总归会忘了大部分内容, 而最终沉淀下来的一点东西, 才是实质真正掌握的. 

所以这回复习的过程中, 我会先以导图的形式, 围绕着当前的知识点, 发散的写下所有脑海里能记得与之相关的知识点(可能是错的), 然后再进行查缺补漏, 把内容一一补上. 

## 预先发散知识
我十分建议在看这篇的同时, 跟我一样先打开一个思维导图类工具或者就是一张白纸和一把笔. 写上目前的知识点, 然后开始先发散自己头脑里与之的记忆链, 不论对错, 这些就是我们大脑里真正对这部分知识所掌握的点. 

例如我是在Xmind中先新建了个空白画板, 写上执行上下文, 给自己25分钟然后开始联想.
![[Pasted image 20221024111126.png]]

25分钟后

![[执行上下文.png]]

## 开始复习

目前网络上关于执行上下文的内容, 存在着2版或者说3版的解释, 以ES3为主和以ES5为主, 同时ES2018又在ES5的基础上添加了一些内容. 因而打算全部都梳理一遍.

### 1. ES3

#### 1.1 JavaScript执行前
对于JavaScript源代码在解析成AST抽象语法树的过程中, 就会在堆内存中开始创建一个`全局对象(globalObject)`.  该对象所有作用域都可以访问. 并且内部包含了一些列预设的函数与属性, 例如Date, Array, setTimeout等, 其中还有window属性会指向自己. 

之后代码转换为字节码后准备开始执行时, v8引擎会在内部创建一个`执行上下文栈(Execution Stack)`
![[v8引擎过程.png]]
![[v8引擎过程.png]]

当准备开始执行全局代码时, 则会创建唯一的`全局执行上下文(Global Execution Context)`.
执行上下文都包含有三个重要属性:
- 变量对象(Variable Object)
- 作用域链(Scope chain)
- this指向

全局执行上下文中的变量对象(VO)即为全局对象(GO), 并且会将this指向该全局对象.  同时压入执行上下文栈中. 作用域链暂且不议.

假设示例代码为:
```js
var name = 'xavier'
var age = 18

function sayHi() {
	return 'hi'
}
```

当代码还未执行, 在全局对象(GO)中所展示为:
```js
var globalObject = {
	// 存在一堆预设的函数和属性, 例如String, Nunber, Date那些类 忽略不写
	window: globalObject,
	name: undefined,
	age: undefined,
	sayHi: <func>, // 指向函数空间的内存地址
}

// 该<func>会在内存中开辟一块空间来存储
// 伪代码类似于
// {
//	[[scpoe]]: 指向父级作用域,
//	函数的执行体
// }

```

此时的执行上下文栈的展示为:
![[执行上下文栈1.png]]

之后代码才真正开始逐行执行. 

> 这里就解释了为什么var变量存在变量提升的原因. 
> 即使代码还未执行, 当创建了GO对象时, 已经为var变量赋值为了undefined. 
> 因而之后代码执行时, 即使是在变量声明之前调用, 也不会报错, 并且会返回为undefined.


#### 1.2 JavaScript执行时

假设示例代码为:
```js
var name = 'xavier'
console.log(age)
var age = 18

sayHi()
function sayHi() {
	console.log(name)
	var name = 'parker'
	return 'hi ' + name
}
```

对于执行前的状态与上面一致.
逐行执行时, 当碰到第二行输出age时, GO目前的状态为:
```js
var globalObject = {
	window: globalObject,
	name: 'xavier',
	age: undefined,
	sayHi: <func>, // 指向函数空间的内存地址
}
```

因而age会输出为undefined. 

当到了第五行执行 sayHi()时, V8引擎则会创建一个`函数执行上下文(function Execution Context)`, 并且一样存在变量对象(此时的变量对象称为活动对象(AO)), 作用域链和this指向.  同时压入到 执行上下文栈中. 

函数的变量对象称为活动对象的原因为, 该对象只有在函数执行上下文中才会被激活, 只有被激活的变量对象, 才可以访问它上面的各种属性和方法. 因而此时内存中创建的AO显示的状态为:
```js
var activationObject = {
	argument: {
		length: 0
	},
	name: undefined,
}
```

此时的执行上下文栈展示为:
![[执行上下文栈2.png]]

之后开始执行函数体的代码,  函数体内部第一行代码为 输出name, 此时在AO对象中所获取到的name还是undefined, 所以输出的结果就是undefined. 这就是函数体内部成为变量提升的原因. 

到了下一行变量声明后, 才将 name赋值为'parker'. 最终返回结果 'hi parker'. 


