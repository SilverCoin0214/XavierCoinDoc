## 前言

之前复习了执行上下文和作用域相关的知识点，基本就是为了闭包的产生原因做了铺垫。JavaScript里很多知识点都属于一环扣一环，或者是一点会牵扯出其他很多的点。在没有完全理解前置知识点前，对于闭包这样的问题大多就单纯属于记忆，由于是面试常喜欢问的点，所以会变成面试前多刷然后记住，可能等不久之后又忘记到底概念上是什么，在代码之后又有哪些涉及到了。

至少我自己经常是如此，只是好在以前经常在学习时有画导图和写下部分笔记，所以对这块即使单纯靠记忆的方面所记得的内容还是相对好一些的。以及我确实也很早就理解了闭包。

还是与之前一样，在打算复习这个知识点之前，先开一个空白的xmind，然后给自己25分钟番茄钟时间发散思维想想与之相关的内容。

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202210261117436.png)

25分钟后

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/%E9%97%AD%E5%8C%85.png)

我目前写文章的模式就是先写下前言，然后开启脑海里跟知识点相关的内容，再开始去重新阅读以前读过的一些书籍里相关的知识或是网络上的文章，然后通过自己吸收后的语言再归纳出认为需要写下和值得理解的地方。

## 闭包是什么？

对于一个知识点来说，我一直认为不论是从什么方面入手，都需要彻底弄懂三个问题，才算真正了解这个知识点，然后具体再去实践中练习，才能称得上掌握。这三个问题就是：
- 是什么？
- 为什么要设计？
- 能用在哪？

首先先回答闭包是什么这个问题。应该大多数人也看过很多与之相关的文章，很多人也给出了自己的解释，所以我也先给出自己理解的解释，那就是：
- `闭包 = 一个函数 + 该函数所处的词法作用域`
- 也就是`闭包是由一个函数并且该函数能够记住声明自己的词法作用域所产生的`。
- 在内存中理解就是， 当一个函数被调用时，`它所产生的函数执行上下文里的作用域链保存有其父词法作用域，所以父变量对象由于存在被引用而不会销毁，驻留在内存中供其使用`。这样的情况就称为闭包。

上述的解释对于已经了解过闭包的人应该是一目了然的，但其实如果对于一个完全不知晓闭包的人来说，很可能是完全看不懂的。更甚至很多人其实仅仅只是记住了这种定义，而不是真的理解了这内涵。

所以我想用一个不一定精准的类比去帮助理解什么是闭包这东西，想象你在掘金上写了一篇文章，并且引用到了掘金里其他作者的3篇文章作为参考。

在发表后被转载到其他的平台上，而其他平台上的读者点开你的文章阅读后想继续看你所引用的那些文章，依旧能准确无误的跳转到那些文章所在的位置（掘金网站里）。

在这个例子中， 所写的文章和写文章的这个环境（就是掘金这网站）就构成了闭包。  不论是在哪里读到文章，文章里所记得的参考文章引用指向永远是掘金平台里的。 

如果觉得还是不好理解，可以指出，我再思考有没更好的类比加以解释。


## 为什么要设计出闭包？

对于为什么设计这点，仅以我自己粗浅的理解就是由于`JavaScript是异步单线程`的语言。对于异步编程来说，最大的问题就是当你编写了函数，而等到它真正调用的时机可能是之后任意的时间节点。

这对于`内存管理`来说是一个很大的问题，正常同步执行的代码，函数声明时和被调用时所需要的数据都还存留在内存中，可以无障碍的获取。而异步的代码，往往声明该函数的上下文可能已经销毁，等到在调用它时，如果内存中已经把它所需要的一些外部数据给清理了，这就是个很大的问题。 

所以JavaScript解决的方案就是`让函数能够记得自己之前所能获取数据的范围，统统都保存在内存里，只要该函数没有被内存回收，它自身以及所能记住的范围都不会被销毁`。

这里的所能记住的范围就是指词法作用域，就是由于它是静态的，所以才需要记住。

这又是JavaScript设计作用域为静态的导致的。 如果是动态作用域，函数被调用时只需要被调用时的那个环境，就不需要存在记住自身作用域的事了。

所以总结一下就是：
- 闭包是为了`解决词法作用域引发的问题`和`内存不好管理异步编程里数据获取`所产生的。


## 经典题

原本我的想法是从最底层来解释闭包的情况，后来在查阅各种文章时发现， 有一篇文章已经写的很好了。 那就是[JavaScript闭包的底层运行机制](https://link.juejin.cn/?target=http%3A%2F%2Fblog.leapoahead.com%2F2015%2F09%2F15%2Fjs-closure%2F "http://blog.leapoahead.com/2015/09/15/js-closure/")， 我觉得可以先看看这篇的讲解然后在看我之后所写的内容。

由于有非常多的文章都从下面这个非常经典的面试题入手，但似乎都没有人真正从最底层讲解过，所以我就打算将整个过程梳理一遍，来明白这其中的差异性。

```js
for (var i = 0; i < 3; i++) {
    setTimeout(function cb() {
        console.log(i);
    }, 1000);
}
```

基本所有有基础的人一眼就能看出输出的是三个3。

然后让修改成按顺序输出，通常只需要修改var成let：

```js
for (let i = 0; i < 3; i++) {
    setTimeout(function cb() {
        console.log(i);
    }, 1000);
}
```

这样就成了输出为0，1，2.并且是同时间输出，而不是每间隔一秒输出一次。

那么问题来了，为什么？

这里可以先不看下面，先写写自己的解释，看看是否跟我写的一样。


### 1. 先来探讨变量i是var的情况。

当代码开始执行时，此时执行上下文栈和内存里的情况是这样：

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202210271113279.png)

然后开始进行循环， 当 i = 0时，第一个定时器被丢入宏任务队列，关于宏任务相关的内容属于事件循环范畴，暂时只需要理解setTimeout会被丢入队列里，等之后执行。

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202210271117683.png)

同理之后的 i = 1, 和 i = 2 都是一样的，最终结果会变成：

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/Pasted%20image%2020221027112202.png)

最终因为 i++导致 i = 3， 循环结束，全局代码执行完毕。此时的结果为：

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/Pasted%20image%2020221027112452.png)

然后开始进入定时器回调函数执行的过程，

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/Pasted%20image%2020221027113207.png)

开始执行第一个定时器里的回调函数，压入了执行上下文栈中，此时的变量对象是AO，执行输出i, 但是在活动对象AO中找不到这个变量，所以去自身作用域链的父作用域上寻找，也就是在GO中，找到了 i 等于3，输出结果3。

同理对于后面两个定时器也是一样的流程，并且实际上定时器开启的时间都是在循环中就立即执行的，导致实际上三个函数的定时1秒时间是一致的，最终输出的结果是几乎同时输出3个3。而不是每间隔1秒后输出3， 当然这是定时器相关的知识了。

### 2. 然后探讨通过var修改成let之后实际上变了什么

同样是刚创建时，所展示的情况为：

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/Pasted%20image%2020221027113819.png)

之后进入循环体，当i = 0时： 

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202210271147284.png)

之后进入 i = 1时的情况： 

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202210271151693.png)

最后进入到 i = 2的情况，与 i = 1基本类似：

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202210271153595.png)

最终 i++，变成i值为3，循环结束。开启定时器工作：

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202210271213490.png)

当执行第一个定时器的回调函数时，创建了函数执行上下文，此时执行输出语句i时，会先从自己的词法环境里寻找变量i的值，也就是在 record环境记录里搜索，但是不存在。因而通过自己外部环境引用outer找到原先创建的块级作用域里 i = 0的情况， 输出了i值为0的结果。  

对于之后的定时器也都是一样的情况，原先的块级作用域由于被回调函数所引用到了，因而就产生了闭包的情况，不会在内存中被销毁，而是一直留着。

等到它们都执行完毕后，最终内存回收会将之全部都销毁。

> 其实以上画的图并不是很严谨，因为在解释var的情况时我用到了ES3里执行上下文的概念， 到了下面用let时转成了ES5里词法环境的概念，同时又混杂了ES3的东西，但是对于理解闭包在内存里的情况还是不影响的。


## 闭包能用在哪？

首先需要先明确一点，`那就是在JavaScript中，只要创建了函数，其实就产生了闭包`。这是广义上的闭包，因为在全局作用域下声明的函数，也会记着全局作用域。而不是只有在函数内部声明的函数才叫做闭包。

通常意义上所讨论的闭包，是`使用了闭包的特性`。

### 1. 函数作为返回值

```js
let a = 1

function outer() {
  let a = 2

  function inside() {
    a += 1
    console.log(a)
  }

  return inside
}

const foo = outer()
foo()

```

此处outer函数调用完时，返回了一个inside函数，在执行上下文栈中表示的既是outer函数执行上下文被销毁，但有一个返回值是一个函数。 该函数在内存中创建了一个空间，其[[scope]]指向着outer函数的作用域。因而outer函数的环境不会被销毁。

当foo函数开始调用时，调用的就是inside函数，所以它在执行时，先询问自身作用域是否存在变量a, 不存在则向上询问自己的父作用域outer，存在变量a且值为2，最终输出3。

### 2. 函数作为参数

```js

var name = 'xavier'
function foo() {
  var name = 'parker'
  function bar() {
    console.log(name)
  }
 console.log(name)

  return bar
}

function baz(fn) {
  var name = 'coin'
  fn()
}

baz(foo())
baz(foo)
```

对于第一个baz函数调用，输出的结果为两个'parker'。 对于第二个baz函数的调用，输出为一个'parker'。

具体的理解其实跟上面一致，只要函数被其他函数调用，都会存在闭包。

### 3. 私有属性

闭包可以实现对于一些属性的隐藏，外部只能获取到属性，但是无法对属性进行操作。

```js
function foo(name) {
  let _name = name
  return {
    get: function() {
      return _name
    }
  }
}

let obj = foo('xavier')
obj.get()
  
```

### 4. 高阶函数，科里化，节流防抖等

对于一些需要存在状态的函数，都是使用到了闭包的特性。

```js
// 节流
function throttle(fn, timeout) {
  let timer = null
  return function (...arg) {
    if(timer) return
    timer = setTimeout(() => {
    fn.apply(this, arg)
    timer = null
    }, timeout)
  }
}

// 防抖
function debounce(fn, timeout){
  let timer = null
  return function(...arg){
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arg)
    }, timeout)
  }
}
```

### 5. 模块化

在没有模块之前，对于不同地方声明的变量，可能会产生冲突。而闭包能够创造出一个封闭的私有空间，为模块化提供了可能性。 可以使用IIFE+闭包实现模块。

```js
var moduleA = (function (global, doc) {
  var methodA = function() {};
  var dataA = {};
  return {
    methodA: methodA,
    dataA: dataA
  };
})(this, document);
```

## 总结

感觉这篇总结归纳的并没有很好，对于闭包还有一些涉及的内容没有提到。不过由于每次写的篇幅都有些过长，感觉能够看完都实属不易。如果其中有哪些概念是在阅读时没理解或者看不懂的，那一定是我写的还不够简洁易懂。

以及在写完后我又看到了一篇关于讲解闭包内存泄露相关的文章：
[一文颠覆大众对闭包的认知](https://mp.weixin.qq.com/s/ocB1ZklY-gPEOCajtaryhw)

里面讲到了目前V8引擎发生了变化， 在为函数绑定词法作用域时，不会再将父函数的AO直接丢进[[scope]]中，而是会分析该函数使用了父函数的那些变量，将这些变量存储到一个叫做 `Closure`的对象里。每一个函数都有且只有一个 `Closure`对象。然后由它代替原来的父函数AO放入到[[scope]]中。 

这样一来最上面相关图解就是有一定问题的，但因为相对来说不妨碍理解最终代码闭包的情况，所以我也就不修改了。

请务必也阅读一下这篇文章。