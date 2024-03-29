## 前言

之前复习到的执行上下文里在ES3版本里说过它包含的三大内容是变量对象，作用域链，this指向。以及ES6版本里词法环境中有的外部环境引用outer。 都是涉及到了今天要复习的知识点， 也就是JavaScript中存在着基于作用域而产生的一条类似链表的链路。

和之前的做法一样， 在对于一个知识点复习前最好先看看自己脑海中对它还留有多少印象和概念。这才是之前学习后所沉淀下的知识，然后再进行温故而知新，才是最好的学习过程。单纯的阅读他人的文章属于被动吸收，其实能留存的记忆是很快消散的。

打开Xmind先写上今天知识点的主题。然后`给自己25分钟时间发散思维`，把脑海中涉及到认为与之相关的内容都写上，不论是对的还是错的，这是自身记忆中最真实的反馈。对了能在之后复习中巩固，错了能在之后复习中修复。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8a4c0a35a804c3eb7fe849f3b308c55~tplv-k3u1fbpfcp-zoom-1.image)

25分钟后

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d63e68f9773f41cba2a2191b3db74269~tplv-k3u1fbpfcp-zoom-1.image)


关于作用域这块，我`强烈建议阅读《你不知道的JS上册》`关于作用域和闭包那一模块，其实那块内容读透了，比阅读很多人写的文章要来的强的多，甚至这篇以下内容不看也没什么。我只是以自身的语言对知识进行重述，加深自我印象。
文章大致以下顺序来梳理：
- 先理解作用域是什么
- 词法作用域又是什么，动态作用域又是什么
- 作用域的分类
- 执行上下文和作用域的关系
- 最终作用域链有什么用

## 1. 作用域是什么？

> 作用域是一套规则，负责收集并维护由所有声明的标识符（变量）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限。

用更好理解的话阐述作用域是什么，则是：
- `作用域首先是一套规则`
- `该规则的用处是用来存储变量，以及如何有限制的获取变量。`

用一个不一定完全恰当的形容来类比作用域就是，存在一个国际银行，你将手里各国的货币存入其中，当你要取出一些钱时，它有一套规则限定你只能在可使用货币的当地才能取出相应的该货币。  这个银行和它制定的规则，就是作用域对于变量的作用。 

## 2. 词法作用域与动态作用域

在JavaScript中，所使用的作用域是词法作用域，也称为`静态作用域`。它是在编译前就确定的。JavaScript本质上是一门编译型语言，只不过它编译发生的时间节点是在代码执行前的几微秒。不同于其他编译型语言是在构建的过程中编译，所以才看上去更像是解释型语言。

关于编译和解释暂且不论，只需要理解到词法作用域就是静态作用域。 理解静态的含义就是`当代码在书写下定义时就已经确定`了。也就是人所读到代码中变量和函数被定义在什么范围，该范围就是它们的作用域。

用一个简单的例子来理解：
```js
var a = 1

function foo() {
  console.log(a)
}

function bar(b) {
  var a = 2
  console.log(a)
  foo()

  function baz() {
      console.log(b)
  }
  return baz
}

var c = bar(a)
c()

```

对于定义的三个函数foo, bar, baz以及变量a，它们在书写时作用域就已经定义。

因而在代码执行时， bar函数先调用传入变量a的值， 在第一个输出变量a值时，会先询问自身作用域是否定义过变量a， 定义过则询问是否存在a的值，存在着输出变量a为2. 

然后开始调用foo函数， foo中只有输出变量a的值， 同样也`会询问自身作用域`是否定义过变量a， foo中未定义， 则会往上寻找`自身定义时的作用域`询问是否定义过变量a， 全局作用域定义过并且存在a值， 因而输出a为1。其实这其中已经涉及到了作用域链，但暂且不议。

之后进入到c函数调用也就是baz函数， baz中输出变量b的值，b会询问自身作用域是否存在定义过变量b， baz未定义， 则往上查找`自身定义时的作用域`也就是bar函数作用域是否定义过变量b， bar实际隐含在参数中为变量b定义并且赋值为1, 因而最终输出为1。

这就是静态作用域，只需要看变量和函数的书写位置，即可确定它们都作用域范围。

与之相对的是`动态作用域`， 在JavaScript中涉及到动态作用域的只有this指向，这在之后复习this时会涉及。 

假设JavaScript是动态作用域，同样看上述例子里的代码执行过程。

bar先调用并传入变量a， 在第一个输出变量a值时， 完全获取到变量a因而输出2。在调用foo函数时， 由于自身作用域没有变量a， 则会`从自身被调用的位置的作用域`去往上查找，则此时为函数bar的作用域，因而输出的a值为2。 

c函数调用也就是baz函数调用时，也同样是自身不存在变量b，去寻找`自身被调用的位置的作用域`，也就是全局作用域，全局作用域中同样未定义过变量b， 则直接报错。 

## 3. 作用域的分类

作用域的分类可以按照上述所说的静动分为：
- `静态作用域`
- `动态作用域`

在静态作用域也就是词法作用域中还可以按照一定的范围细分为：
- `全局作用域`
- `函数作用域`
- `块级作用域`

### 3.1 全局作用域

全局作用域可以理解为所有作用域的祖先作用域， 它包含了所有作用域在其中。也就是最大的范围。反向理解就是`除了函数作用域和被{}花括号包裹起来的作用域之外，都属于全局作用域`。

### 3.2 函数作用域

之所以在全局作用域外还需要函数作用域，主要是有几个原因：
- 可以存在一个更小的范围存放自身内部的变量和函数，外部无法访问
- 由于外部无法访问，所以相当于隐藏了内部细节，仅提供输入和输出，符合最小暴露原则
- 同时不同的函数作用域可以各自命名相同的变量和函数，而不产生命名冲突
- 函数作用域可以嵌套函数作用域，就像俄罗斯套娃一样可以一层套一层，最终形成了作用域链

用一个例子来展示：
```js
var name = 'xavier'

function foo() {
  var name = 'parker'
  var age = 18

  function bar() {
    var name = 'coin'
    return age
  }

  return bar()
}

foo()
console.log(age) // 报错

```

当代码执行时， 最终会报错表示age查找不到。 因为变量age是在foo函数中定义， 属于foo函数作用域中， 验证了第一点外部无法访问内部。

而当代码只执行到foo函数调用时， 其实foo函数有执行过程， 最终是返回了bar函数的调用，返回的结果应该是18。 在对于编写代码的人来说，其实只需要理解一个函数的作用是什么， 然后给一个需要的输入，最后得出一个预期所想的输出，而不需要在意函数内部到底是怎么编写的。验证了第二点只需要最小暴露原则。

在这代码中， 对name变量定义过三次， 但每次都在各自的作用域中而不会产生覆盖的结果。在那个作用域里调用，该作用域就会返回相应的值。这验证了第三点规避命名冲突。

最终bar函数是在foo函数内部定义的，foo函数获取不到bar内部的变量和函数，但是bar函数可以通过作用域链获取到其父作用域也就是foo里的变量与函数。这验证了第四点。

### 3.3 块级作用域

块级作用域在ES6之后才开始普及，对于是var声明的变量是无效的，仅对let和const声明的变量有效。以{}包裹的代码块就会形成块级作用域， 例如if语句， try/catch语句，while/for语句。但声明对象不属于。

```js
let obj = {
  a: 1,   // 这个区域不叫做块级作用域
}  

if (true) {  // 这个区域属于块级作用域
  var foo = 1
  let bar = 2
}

console.log(foo)  // 1
console.log(bar)  // 报错
```


用一个大致的类比来形容全局作用域，函数作用域和块级作用域。一个家中所有的范围就称为全局作用域，而家中的各个房间里的范围则是函数作用域， 甚至可能主卧中还配套有单独的卫生间的范围也属于函数作用域，拥有的半开放式厨房则是块级作用域。

假设你要在家中寻找自己的猫，当它在客厅中，也就是全局作用域里，你可以立马找到。但如果猫在房间里，而没发出声音。你在客厅中是无法判断它在哪里，也就是无法找到它。这就是函数作用域。但是如果它在半开放式厨房里，由于未完全封闭，它是能跑出来的，所以你还是能找得到它。 反之你在房间里，如果它也在，那么可以直接找到。但如果你在房间而它在客厅中，则你可以选择开门去客厅寻找，一样也能找到。

## 4. 执行上下文和作用域的关系

上述的过程过于理论化，因而现在通过对于实质的情况也就是内存中的情况来讨论。

之前上一篇说过在ES3中执行上下文都有三大内容：
- 变量对象
- 作用域链
- this

实际在内存中，对于全局作用域来说，它所涵盖的范围就是全局对象GO。因为全局对象保存了所有关于全局作用域中的变量和方法。

而对于函数来说，当函数被调用时所创建出的函数执行上下文里的活动对象AO所涵盖的范围就是函数作用域， 并且函数本身存在有一个内部属性`[[scope]]`， 它是用来保存其父作用域的，而父作用域实际上也是另一个变量对象。

对于块级代码来说，就不能用ES3这套来解释，而是用ES6中词法环境和变量环境来解释。块级代码会创建出块级执行上下文，但块级执行上下文里只存在词法环境，不存在变量环境，因而这词法环境里的环境记录就是块级作用域。

相同的解释对于全局和函数也一样，对于ES6中，它们执行上下文里的词法环境和变量环境的环境记录涵盖的范围就是它们的作用域。

用一段代码来更好的理解：
```js
var a = 'a'

function foo() {
    let b = 'b'
    console.log(c)
}

if (true) {
    let a = 'c'
    var c = 'c'
    console.log(a)
}

foo()
console.log(a)
 
```

对于这段代码刚编译完准备开始执行，也就是代码创建时，此刻执行上下文栈和内存中的图为：
![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08ExecutionContext/202210252222987.png)

当开始进行到if语句时，会创建块级执行上下文，并执行完if语句时执行上下文栈和内存图为：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/267099b9596f4234949ed32c28c853cc~tplv-k3u1fbpfcp-zoom-1.image)

当if语句执行完后， 就会被弹出栈，销毁块级执行上下文。然后开始调用foo函数，创建函数执行上下文，此时执行栈和内存图为：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e1b8b7fa7be4024af8caffbbdd45dac~tplv-k3u1fbpfcp-zoom-1.image)

当foo执行时，变量b被赋值为'b'，同时输出c时会在自身环境记录中寻找，但未找到，因而往上通过自身父作用域，也就是全局作用域的环境记录中寻找，找到c的值为'c'，输出'c'。


## 5. 作用域链

通过上文阐述的各个知识点，作用域链就很好理解了，在ES3中就是执行上下文里其`变量对象VO + 自身父作用域`，然后每个执行上下文依次串联出一条链路所形成的就是作用域链。

而在ES6中就是执行上下文里的词法环境里的`环境记录+外部环境引用`。外部环境引用依次串联也会形成一条链路，也属于作用域链。

它的作用在于`变量的查找路径`。当代码执行时，遇到一个变量就会通过作用域链不断回溯，直到找到该值又或者是到了全局作用域这顶层还是不存在，则会报错。

以及之后关于闭包的产生，也是由于作用域链的存在所导致的。这会在之后的复习里涉及到。

## 6. 一些练习

### 6.1 自己设计一道简单的练习题
```js

var a = 10
let b = 20
const c = {
  d: 30
}

function foo() {
  console.log(a)
  let e = 50
  return b + e
  a = 40
}

function bar() {
  console.log(f)
  var f = 60
  let a = 70
  console.log(f)
  return a + c.d
}

if (a <= 30) {
  console.log(a)
  let b = foo()
  console.log(b)
} 

console.log(b)
c.d = bar()
console.log(a)
console.log(c.d)

```

 
## 总结

能完整看下来的人实属不易，如果其中觉得有任何看不懂或者不理解的地方，那一定不是你的问题，而是我的问题。说明是我梳理的还不够透彻，可以请不吝指出，我会想想还有哪些更好的方式来回答。