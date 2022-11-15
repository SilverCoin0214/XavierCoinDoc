> Education is what remains after one has forgotten everything he learned in school

## 前言
近期正准备重新复习一遍关于JavaScript相关的一些核心知识，原本习惯是以思维导图作为归纳总结。

但后面想想输出可能才是最高形式的总结和再度学习，很多知识点在阅读和吸收时通常能快速理解，但实际再对外输出时，可能就没有那么的精准和通顺。 

以及我一直认为学习之后总归会忘了大部分内容，而最终沉淀下来的一点东西，才是实质真正掌握的。

所以这回复习的过程中，我会先以导图的形式，围绕着当前的知识点，发散的写下所有脑海里能记得与之相关的知识点(可能是错的)，然后再进行查缺补漏，把内容一一补上。 

## 预先发散知识
我十分建议在看这篇的同时，跟我一样先打开一个思维导图类工具或者就是一张白纸和一把笔。写上目前的知识点，然后开始先发散自己头脑里与之的记忆链，不论对错，这些就是我们大脑里真正对这部分知识所掌握的点。 

例如我是在Xmind中先新建了个空白画板，写上执行上下文，给自己25分钟然后开始联想。

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08ExecutionContext/Pasted%20image%2020221024111126.png)

25分钟后

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08ExecutionContext/%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87.png)

## 开始复习

目前网络上关于执行上下文的内容，存在着2版或者说3版的解释，以ES3为主和以ES6为主，同时ES2018又在ES6的基础上添加了一些内容。因而打算全部都梳理一遍。

### 1. ES3

#### 1. 1 预先知识
关于ES3中对于执行上下文所需要先了解的大致相关概念有:
- `执行上下文栈(Execution Stack)`
- `变量对象(VO)`: 不同执行上下文中的VO不同，全局执行上下文为`全局对象(GO)`，函数执行上下文为`活动对象(AO)`
- 执行上下文场景:
	- `全局执行上下文`
	- `函数执行上下文`
	- eval函数执行上下文(几乎不用)
- 执行上下文的阶段:
	- 创建阶段
	- 执行阶段

##### 1.1.1 执行上下文栈
执行上下文栈是V8引擎用来`管理执行上下文的数据结构`。
栈的特点就是`先入后出`，因而先入的上下文会在最后才弹出，而最先入的上下文一定是全局执行上下文。 当执行上下文栈被清空，意味着代码执行完毕。

全局执行上下文会在v8引擎第一次遇到代码时创建，并推入执行上下文栈中。之后再代码执行过程中，一旦出现函数调用时，则会为该函数创建一个新的执行上下文, 然后推入栈中。并在执行完毕之后，再弹出栈。 

通过事例代码来了解:
```js
var name = 'xavier'
var age = 18

function foo() {
	console.log('inside foo function')
	bar()
	console.log('inside foo function again')
}

function bar() {
	console.log('inside bar function')
	baz()
	console.log('inside bar function again')	
}

function baz() {
	console.log('inside baz function')
}

foo()
```

那么当代码执行到最底部foo函数调用时，在执行上下文栈所显示的调用过程为:
![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08ExecutionContext/%E8%B0%83%E7%94%A8%E6%A0%88.png)

事实上函数代码体是存在于内存之中通过VO里的属性指向该内存地址，此处放到执行上下文中只是为了更方面理解。

##### 1.1.2 变量对象
变量对象是用于存储执行上下文中的数据记录。是执行上下文三大属性之一。 
对于函数执行上下文的变量对象，存储的就是内部相关的变量和函数声明。 
对于全局执行上下文的变量对象，存储的就是全局对象本身。

变量对象全部都存储在内存之中，因而全局对象在代码没执行完毕之前，永远会驻留在内存中。 

##### 1.1.3 执行上下文的场景
在JavaScript中，有以下几种类型的执行上下文

- `全局执行下文` - 会在v8引擎遇到js代码时就创建，并且一个程序中`只会有一个全局执行上下文`
- `函数执行上下文` - 需要再代码执行函数被调用时，才会为该函数创建一个函数执行上下文。函数执行上下文可以有任意多个。并且在调用完毕后会被销毁。
- eval函数执行上下文 - 几乎不使用，所以不用关注。

##### 1.1.4 执行上下文的阶段
对于过程来说，仅需要分为
- 创建阶段
- 执行阶段


#### 1.1 JavaScript创建阶段
对于JavaScript源代码在解析成AST抽象语法树的过程中，就会在堆内存中开始创建一个`全局对象(globalObject)`。该对象所有作用域都可以访问。并且内部包含了一些列预设的函数与属性，例如Date，Array，setTimeout等，其中还有window属性会指向自己。 

之后代码转换为字节码后准备开始执行时，v8引擎会在内部创建一个`执行上下文栈(Execution Stack)`

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08ExecutionContext/v8%E5%BC%95%E6%93%8E%E8%BF%87%E7%A8%8B.png)

当准备开始执行全局代码时，则会创建唯一的`全局执行上下文(Global Execution Context)`。
执行上下文都包含有三个重要属性:
- `变量对象(Variable Object)`
- `作用域链(Scope chain)`
- `this指向(this value)`

全局执行上下文中的变量对象(VO)即为全局对象(GO)，并且会将this指向该全局对象。同时压入执行上下文栈中。作用域链暂且不议。

假设示例代码为:
```js
var name = 'xavier'
var age = 18

function sayHi() {
	return 'hi'
}
```

当代码还未执行，在全局对象(GO)中所展示为:
```js
var globalObject = {
	// 存在一堆预设的函数和属性，例如String，Nunber，Date那些类 忽略不写
	window: globalObject,
	name: undefined,
	age: undefined,
	sayHi: <func>, // 指向函数空间的内存地址
}

// 该<func>会在内存中开辟一块空间来存储
// 伪代码类似于
// {
//	  [[scpoe]]: 指向父级作用域，
//	  函数的执行体
// }

```

此时的执行上下文栈的展示为:
![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08ExecutionContext/%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87%E6%A0%881.png)

之后代码才真正开始逐行执行。

> 这里就解释了为什么var变量存在变量提升的原因。 
> 即使代码还未执行，当创建了GO对象时，已经为var变量赋值为了undefined。 
> 因而之后代码执行时，即使是在变量声明之前调用，也不会报错，并且会返回为undefined。


#### 1.2 JavaScript执行阶段

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

对于执行前的状态与上面一致。
逐行执行时，当碰到第二行输出age时，GO目前的状态为:
```js
var globalObject = {
	window: globalObject,
	name: 'xavier',
	age: undefined,
	sayHi: <func>, // 指向函数空间的内存地址
}
```

因而age会输出为undefined。 

当到了第五行执行 sayHi()时，V8引擎则会创建一个`函数执行上下文(function Execution Context)`，并且一样存在变量对象(此时的变量对象称为活动对象(AO))，作用域链和this指向。同时压入到 执行上下文栈中。

函数的变量对象称为活动对象的原因为，`该对象只有在函数执行上下文中才会被激活`，只有被激活的变量对象，才可以访问它上面的各种属性和方法。因而此时内存中创建的AO显示的状态为:
```js
var activationObject = {
	argument: {
		length: 0
	},
	name: undefined,
}
```

此时的执行上下文栈展示为:
![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08ExecutionContext/%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87%E6%A0%882.png)

之后开始执行函数体的代码，函数体内部第一行代码为 输出name，此时在AO对象中所获取到的name还是undefined，所以输出的结果就是undefined。这就是函数体内部成为变量提升的原因。

到了下一行变量声明后，才将 name赋值为'parker'。最终返回结果 'hi parker'。 

而当函数执行完之后，执行上下文栈就会把函数执行上下文给弹出栈。函数执行上下文就会被销毁。而AO对象则因为内存管理中如果有其他对象指向，可能并不会被销毁，从而导致了JS的闭包，不过在此暂且不谈。 在无其他对象指向时，AO对象在内存中也一并被销毁。


### 2. ES6
#### 2.1 预先知识
对于ES6之后的执行上下文需要大致预先了解的相关知识有:
- 执行上下文栈
- `词法环境(lexical environment)`
- `变量环境(variable environment)`
- 执行上下文场景
- 执行上下文的阶段

对于执行上下文栈和执行上下文的阶段来说，跟ES3并没有太大区别，所以就不加以赘述。
执行上下文场景由`全局执行上下文`，`函数执行上下文`，由增加了`块级执行上下文`。 
还需要了解的新概念有词法环境和变量环境。在ES6中去除了变量对象和作用域链的概念。仅保留了this指向。
因而当前的执行上下文的三大属性变为了:
- 词法环境
- 变量环境
- this指向

##### 2.1.1 词法环境
词法环境可以理解为ES3中变量对象和作用域链合并而成的一种类型。是一种标识符与变量数据的映射。 
它首先有两部分组成:
- `环境记录(Environment Record)` :  可以理解为ES3里变量环境的作用
- `外部环境引用(Reference to the outer environment)`: 可以理解为ES3里作用域链的作用

环境记录存在有两种类型:
- 声明式环境记录`(Declarative environment record)` : 用于存储变量和函数声明，例如`var/ const/ let/ class/ module/ import` `
- 对象环境记录`(Object environment record)` : 除了存储变量和函数声明以及async，generator，对象环境记录还存储了一个全局对象，在浏览器中即为window对象。对于每个绑定对象的属性, 环境记录都会创建一个新的条目。 

tips: 对于函数代码来说，环境记录还包含有 argument对象和参数长度length。

词法环境又存在有3中类型:
- 在`全局环境`中, 环境记录是`对象环境记录`，并且其不存在有外部环境引用, 指向的值为null
- 在`函数环境`中, 环境记录是`声明式环境记录`，其外部环境引用需要根据词法作用域来判断。 
- 在`模块环境`中(仅node中): 环境记录是`声明式环境记录`，其外部环境引用指向全局环境。

以伪代码来说，词法环境大致长为这样:
```js
GlobalExectionContext = {
	LexicalEnvironment: {
		EnvironmentRecord: {
			Type: 'Object',
			// 标识符相关的映射合计在此存放
		},
		outer: <null>, 
	}
}

FunctionExectionContext = {
	LexicalEnvironment: {
		EnvironmentRecord: {
			Type: 'Declarative',
			// 标识符相关的映射合计在此存放
		},
		outer: <Global or outer function environment reference>
	}
}
```

##### 2.1.2 变量环境
`变量环境本质上也是一个词法环境`，只不过它的环境记录会在执行上下文创建时就为变量声明赋值。 
对于变量环境和词法环境的区别，词法环境用于存储函数的声明和变量(let与const)绑定，而变量环境仅用于变量(var)的绑定。 

#### 2.2 JavaScript创建阶段
对于JavaScript源代码最终成为字节码的过程中，一样会创建`全局对象`和`执行上下文栈`。
之后当JavaScript代码开始准备执行时，V8引擎就会创建`全局执行上下文`。

通过示例代码来理解:
```js
let a = 10
const b = 20
var c = 30

function add(d, e) {
	var f = 40
	return d + e + f
}

c = add(50, 60)
```

在创建阶段全局执行上下文的伪代码看起来类似于:
```js
GlobalExectionContext = {

	ThisBinding: <Global Object>,
	
	LexicalEnvironment: {
		EnvironmentRecord: {
			Type: 'Object',
			a: <uninitialized>,
			b: <uninitialized>,
			add: <func>
		},
		outer: <null>, 
	},

	VariableEnvironment: {
		EnvironmentRecord: {
			Type: 'Object',
			c: undefined,
		},
		outer: <null>, 
	}
}

```

#### 2.3 JavaScript执行阶段

继续通过示例代码来解释:
```js
console.log(a)
console.log(b)
console.log(c)

let a = 10
const b = 20
var c = 30

function add(d, e) {
	var f = 40
	return d + e + f
}

c = add(50, 60)
```

当JavaScript真正开始逐行执行时，首先碰到了前三行的输出语句。此时全局执行上下文里的状态还是创建时的状态。因而变量a和b在上下文中还是`uninitialized`，这就是为什么let和const在声明之前会报错的原因。而变量c存储在变量环境中同时创建时初始化赋值`undefined`。这就是解释变量提升的最本质因素。

函数则是在创建时就已经被放入内存中开辟的新空间中，因而无论在何处调用。都可以获取到内存中函数执行的函数体。 

当代码运行到最后一行前，此时的全局上下文的状态为:
```js
GlobalExectionContext = {

	ThisBinding: <Global Object>,
	
	LexicalEnvironment: {
		EnvironmentRecord: {
			Type: 'Object',
			a: 10,
			b: 20,
			add: <func>
		},
		outer: <null>, 
	},

	VariableEnvironment: {
		EnvironmentRecord: {
			Type: 'Object',
			c: 30,
		},
		outer: <null>, 
	}
}
```
都以完成赋值操作，之后进入函数add的调用，此时v8引擎会创建一个新的函数执行上下文，所以此时对于函数的执行上下文创建阶段的状态为:

```js
FunctionExectionContext = {

	ThisBinding: <Global Object>,
	
	LexicalEnvironment: {
		EnvironmentRecord: {
			Type: 'Declarative',
			Arguments: {0: 50, 1: 60, length: 2}
		},
		outer: <GlobalLexicalEnvironment>, 
	},

	VariableEnvironment: {
		EnvironmentRecord: {
			Type: 'Declarative',
			f: undefined,
		},
		outer: <GlobalLexicalEnvironment>, 
	}
}
```

之后进入函数的执行阶段，在执行阶段的过程中，函数执行上下文的状态修改为:

```js
FunctionExectionContext = {

	ThisBinding: <Global Object>,
	
	LexicalEnvironment: {
		EnvironmentRecord: {
			Type: 'Declarative',
			Arguments: {0: 50, 1: 60, length: 2}
		},
		outer: <GlobalLexicalEnvironment>, 
	},

	VariableEnvironment: {
		EnvironmentRecord: {
			Type: 'Declarative',
			f: 40,
		},
		outer: <GlobalLexicalEnvironment>, 
	}
}
```

最后执行完毕将值赋值给变量c，因而全局执行上下文里变量环境中的c所引用的数据修改为150。 
程序执行完毕。


### 3. ES2018
#### 3.1预先知识
对于ES2018的执行上下文与ES5的对比来说，最大的改变在于执行上下文中的内容增加了许多。

在ES6中, 执行上下文的3个部分为:
- 词法环境(lexical environment)
- 变量环境(variable environment)
- this指向(this value)

在ES2018中，执行上下文中的内容为:
- 词法环境(lexical environment)
- 变量环境(variable environment)
- 代码恢复位置(code evaluation state)
- 活动函数对象(Function)
- 被执行的代码(ScriptOrModule)
- 使用的基础库和内置对象实例(Realm)
- 当前的生成器, 仅生成器上下文存在(Generator)

在最新的ES2022中，执行上下文又在ES2018基础上新增了一个`私有环境(Private environment)`，也是一种词法环境，差别在于只包含class生成的私有变量，如无则为null。

对比ES5和ES2018中最大的区别会发现，`2018的this指向没有包含在内容中，而是被整合到了词法环境中。`

因而当前的词法环境从原来的两个部分变为三个部分:
- `环境记录 (Environment Record)`
- `外部指向的引用 (Reference to the outer environment)`
- `this绑定  (This binding)`

#### 3.2 差异点
##### 3.2.1 词法环境相关差异

在上面的代码作为例子: 
```js
let a = 10
const b = 20
var c = 30

function add(d, e) {
	var f = 40
	return d + e + f
}

c = add(50, 60)
```

如果是处于代码创建过程中，那么此时的全局执行上下文的状态就变为:

```js
GlobalExectionContext = {
	
	LexicalEnvironment: {
		EnvironmentRecord: {
			Type: 'Object',
			a: <uninitialized>,
			b: <uninitialized>,
			add: <func>
		},
		outer: <null>, 
		ThisBinding: <Global Object>,
	},

	VariableEnvironment: {
		EnvironmentRecord: {
			Type: 'Object',
			c: undefined,
		},
		outer: <null>, 
		ThisBinding: <Global Object>,
	}
}

```

ThisBinding会存放在词法环境和变量环境中，而不是被单独处于执行上下文里。


## 总结

基于ECMA对规范对于执行上下文不断的在完善，所以随着时间的发展，文中的内容多多少少会存在不少问题.  甚至可能现在其中都有些问题存在，如有看到，望恳指出。

对于之类相对抽象的概念来说, 通过阅读他人的文章可能仅能做到理解，最好的方式还是自己在学习完后再次输出。将所记忆和理解到的内容通过自己的言语给复述成笔记或是思维导图。那样可能会对知识又更深刻的理解。




