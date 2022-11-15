## 前言

对于this这个知识点来说，一直拖了好久才想着要动手来写。主要是没想明白应该如何用不同的方式来梳理这个点，毕竟在网络上有不计其数的文章都写过关于this的知识点，毕竟这确实属于JS中里的一个难点，或者说是它设计的本身就有些问题，导致了最终理解难度大增。

很多人对于this的理解真就是背下来的四大绑定然后外加狂刷各种这辈子都不会在业务里写到的this面试题，达成对于这个知识点的掌握。要说有没什么问题呢，我觉得也是没什么问题的，毕竟这也是掌握，尤其在目前前端环境里以hooks和Compositon的版本里，this和它相关的call/apply/bind已经开始退环境了，相对来说对于深刻理解就没那么重要。 不过也许在下一个版本里它又日趋重要了呢，所以我认为对于这类基础知识，掌握和理解的再深都是值得的。它就是JavaScript里最重要的一部分，绕开了它就无从谈起自己真正掌握了JS。

对于this，就没有提前给自己25分钟整理脑海中的发散知识了，因为在此之前我已经阅读过了很大一块相关性的文章和书籍，目前的记忆就是不准确的，因为保存了很多新的记忆点，而不是原来脑海里留下的。

所以这回我是打算直接开始，依旧是从三个点入手，来梳理清this这个知识点，那就是：
1. 是什么
2. 为什么要设计
3. 怎么用 / 实际运用中是什么样

## this是什么？

想想如果一个面试官问你，this是什么，你应该怎么回答？
我的回答是， `this是在函数内部，当被调用时用于指向访问该函数的对象。它的指向与自身在哪里声明没有关系，只取决于函数被调用的方式。` 

缩减了就是， `this是用来指向对象的。`  指向的是什么对象？ 去**调用这个函数的对象**。
里面的关键词是对象。 之前有到说this会涉及动态作用域的说法是不严谨的，虽然在js内部，作用域实际在内存中的表现跟对象类似，但是作用域这概念是无法在js代码里访问的，而对象可以。

实际的定义就是这么简单，但具体处理起来会有些复杂。
但基本只要脑海里有这么个定义，其实很多时候就不需要在记忆什么四大绑定的规则，规则的本质是总结经验，是别人将经验归纳得出然后告诉，而不是自己真正推导出来的。 当自己知晓怎么推导时，才能在任何情况下都得出答案。 

例如存在一些规则之外的情况，虽然除了面试题之外现实中也见不到：

```js
function foo() {
  console.log(this)
}

var obj1 = {
  foo: foo
}
var obj2 = {}; // 此处的;很重要,js的另一个细节知识点。

(obj2.baz = obj1.foo)()
```

这代码里最后一行输出的this是什么？
能一下子答出最终指向window的说明对this掌握已经很不错了。
直接从对象调用入手来看， 赋值语句obj2.baz = obj1.foo最终会返回右边obj1.foo的值，也就是foo函数。那么foo在全局环境下被调用，调用它的对象就是全局对象。 所以是window。

## 为什么要设计this?

在之前执行上下文里有说到，早在最初的ES3版本里，this就是三大属性之一，所以this是一个在最初就被定下的设计。
在设计这门语言之时，就已经规划了它的存在。

而它的存在，主要是当时环境下的产物。
1. `当时设计JavaScript的想法是类JAVA，但是又不能存在class，需要基于对象，而不是基于类。` 
2. `JavaScript将函数定义为了一等公民，函数可以作为独立函数或是对象的方法在任意地方被调用。` 
3. `类JAVA则需要符合面向对象的思想，面向对象的想法就是函数是基于对象的方法被调用的。` 

在这三点的情况下，就需要存在一种机制，**让JavaScript里的独立函数能够找到调用自己的对象**。换句话说就是 `作为这个对象的方法被调用`。
因此this就诞生了。 它就是用来指向那个调用当前函数的对象的。

但这个设计最终导致了this只能在运行阶段被知晓，不利于性能优化。
并且对于很多程序员来说，它的可读性也不高，容易产生很多困惑的地方甚至引起bug。

因此在目前面向函数的思想下，它可能就会日渐式微了。
不过即使如此，还是要掌握在实际之中它是怎么运用的。

## this实际在代码运行阶段时是怎么执行的？

### 1.  最基础的情况

实际上在之前内存的文章里我就说过，当弄清代码在运行时，内存中的情况，就会对语言本身的很多机制能够非常细致的了解，所以我依旧是以代码运行时内存里的情况来解释this的执行。在我看来这远比很多文章总结四大绑定去理解this要来的更容易，且好吸收且更接近本质。

看一个最初的案例：

```js
var a = 10;
function foo () {
  console.log(this.a)
}
foo();
```

直接到foo函数调用前执行上下文栈和内存里的情况：

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202211071452431.png)

当开始执行foo函数，foo函数的函数执行上下文被创建并压入栈中。此时在创建函数上下文时，foo函数被谁调用的呢，在全局环境下的独立调用，都默认是全局对象对函数的调用，因此创建上下文时，会把this指向为全局对象，在浏览器里就是window。

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202211071457952.png)

因此在函数体里的代码执行输出 this.a时就很清晰的能知道，它找到找到就是window对象下的变量a的值。 所以输出10。

#### 1.1 基础的情况的变种

对于把变量var改成let之后，对于最终的结果就有所改变了，不过这其实属于的是作用域那块的知识，this指向没变，但是变量a的位置变了。

```js
let a = 10;
function foo () {
  console.log(this.a)
}
foo();
```

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202211071505976.png)

被let或者const声明的变量不会挂载到window对象上，也就是全局对象。因此this指向全局对象，但是底下没有变量a, 所以最终输出undefined。

### 2. 存在被对象调用的情况

第一种基本情况可以理解为四大绑定里的默认绑定，而现在这种就是所谓的隐式绑定，但隐式绑定存在着很多问题，也才导致了this指向看的不清晰。 所以直接舍去这些，就单纯看调用的情况去理解。

依旧是一个案例：
```js
function foo () {
  console.log(this.a)
};
var a = 2;
var obj = { a: 1, foo };
var foo2 = obj.foo;
var obj2 = { a: 3, foo2: obj.foo }

obj.foo();
foo2();
obj2.foo2();
```

依旧先画出三个函数还没调用时执行上下文栈和内存中的情况：

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202211071600117.png)

现在开始执行obj.foo()这行代码，也就是obj对象调用自己的foo函数，所以foo函数创建执行上下文，并压入栈中，由于是obj调用，所以此时this指向的就是它。

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202211071601914.png)

所以输出结果很直观清晰的显示，this指向了obj, 那么this.a就是obj.a。所以结果就是1。

然后到了foo2函数执行，foo2是在全局环境下被调用，因此是全局对象调用了foo2。所以在创建执行上下文时this指向的就是window。

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202211071603637.png)

因而在执行代码时，从图里一眼就看的出this.a指代的就是window.a，所以结果为2。

到了执行代码obj2.foo2()，调用foo2函数的是obj2，因而它的this指向就是obj2。foo2函数时被赋值为obj.foo，而obj.foo里存入的又是一个函数的引用地址值。所以它们都指向同一个函数foo。

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202211071604453.png)

在图里又很直观的看出 this.a就是obj2.a。所以输出结果为3。

对于记忆隐式绑定的规则的话，这里面就存在成为绑定丢失的问题，但是在内存和执行栈里，这些调用都是一目了然的。

### 3.对于存在call/apply/bind的情况

这里暂时先不复习call/apply/bind里的细节问题，只需要记着它们三的作用就一个，强制绑定this的对象的值就行。 所以当存在他们绑定时，它们指定this指向啥就是啥。除了指向为null和undefined，这两者不属于对象，所以相当没指向。还有个小细节是绑定一次后，再指定绑定其他对象是无效的。

用一个例子来解析：
```js
var obj1 = {
  a: 1
}

function bar() {
  console.log(this.a)
}

var obj2 = {
  a: 2,
  foo1: bar,
  foo2: function () {
    setTimeout(bar, 0)
  },
  foo3: function () {
    setTimeout(bar.bind(obj1), 1000)
  },
}
var a = 3

obj2.foo1()
obj2.foo2()
obj2.foo3()
```

依旧是除了函数内调用时，代码在栈中和内存中的情况如图：

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202211071645196.png)

对于第一个obj2.foo1()调用，我就不画图了，很直观就能知道this.a就是obj2.a所以结果为2。

对于第二个obj2.foo2()调用，这时产生了计时器，所以是函数执行开启执行器，setTimeout里的回调函数bar被压入宏任务队列中，等待全局代码执行完后执行。
对于第三个obj2.foo3()调用也是如此，但是多了一个回调函数使用了bind绑定了this, 强制绑定为obj1。
此时在图里显示的情况就是：

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202211071644301.png)

全局代码执行完毕。此时开始处理宏任务队列里的回调函数，第一次开始调用bar函数，创建函数执行上下文，**此时的bar函数在全局的环境中，所以默认是被全局对象给调用**，则this指向为window。
所以this.a实际为window.a， 结果为2。

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202211071646396.png)

到了第二个定时器的回调函数，**此时由于强制绑定了this指向对象为obj1**，所以结果就是this.a为obj1.a，结果为1。

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202211071649241.png)

### 4. 对于new指定this的情况

new关键字在实现里会返回一个新对象，这个对象里隐藏的__proto__属性会指向其构造函数的原型。这属于原型相关的知识，之后复习会涉及到，现在只需要知道当 new一个对象时，其构造函数里的this指代的就是这个对象就行。

所以下面的案例里, 在new的过程中, Person构造函数里的this指代的就是person1。因此person1.name获得的值就是xavier。
```js
function Person (name) {
  this.name = name
}
var name = 'window'
var person1 = new Person('xavier')
console.log(person1.name)
```

### 5. 关于箭头函数

ES6里出现的箭头函数，其实反而更符合js本身的设计，就是this也是被词法作用域所控制。在编译阶段就已经明确了this的指向，而不是在运行阶段才确定。但其实也就是因为又存在了箭头函数这情况，导致this会变得更复杂，因为上述是运行阶段去判断this, 所以能明确内存时怎么调用也就知晓this的指向，然后又出现一个this属于静态指向，在编译时就确定。产生了动态和静态两种情况，放到代码里又增加了复杂度。

`箭头函数不会创建自己的this, 而是从自己的作用域链上继承this。` 

所以其实实际的情况中，更多的是直接用箭头函数，能够更直观也在阅读代码时就能知道this到底指向的是哪个对象。

用一个案例来说明：
```js
var obj = {
  name: 'obj',
  foo1: () => {
    console.log(this.name)
  },
  foo2: function () {
    console.log(this.name)
    return () => {
      console.log(this.name)
    }
  }
}
var name = 'window'
obj.foo1()
obj.foo2()()
```

在最底下两行函数还没被调用时，情况如下图：
![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202211081530459.png)

当开始调用ojb.foo1时，**它内部的this已经根据词法作用域处于全局作用域下而被指定为window**。因此内部的this.name就是window.name而输出字符串 window。

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202211081546596.png)

当调用obj.foo2()()时，第一次先是由obj调用了foo2函数，所以对于foo2函数来说，它的this指向为obj。因而this.name的结果就是obj.name，输出为字符串obj。

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202211081545299.png)

然后开始了foo2函数返回了一个箭头函数， 箭头函数又被调用。**此时产生了闭包，foo2函数的执行上下文被销毁了，但在内存中保存的环境并没有被销毁，内部的this还是指向obj。** 所以这个被调用的箭头函数当前的词法作用域是在foo2函数下，foo2函数里的this指向obj，该箭头函数就继续继承这个this。 所以内部的this.name还是obj.name，输出字符串obj。

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202211081545348.png)


## 总结

虽然写了这么并且案例是用的较为简单的例子，而不是其他文章里那种各种嵌套的this的面试题，但是只要按照上述的方法进行拆解分析，能够看明白函数究竟是被哪个对象所调用的，对this的问题其实就迎刃而解了。

掌握分析的能力比记住规则更重要。





