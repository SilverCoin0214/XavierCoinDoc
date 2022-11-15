## 前言

知识的链条一直都是一链套着一链的，之前复习了this，所以自然就要涉及到跟它相关性最强的3个函数以及也涉及绑定this的new。本质上也是因为this就是曾经JS中的重难点，所以围绕它展开的知识都是面试最喜欢涉及到的点，因而对它们的讲解也就是最多的。

前端的知识真的属于卷的飞起，通常前两三年属于提升或者拔高的内容，到了现在就必须属于基础。至少以前我看到这类知识时，都还是深入，进阶，高级之类的前缀，但到了现在基本已经被叫做基础了。

然后现在进阶深入的就属于源码，框架底层，感觉再用不了多久可能就是编译器，解释器的阶段了。

不过话说回来，只说现在这4个函数，正常使用对绝大多数人应该是毫无难度的，对于立刻手写实现来说，可能就有一些难度，但看完文章之后有立马能够写出，本质上就因为人是会遗忘的生物，知识点太久没复习，会自然而然的将之忘记，然后重新通过阅读唤醒后，又能把之前的记忆找回来。

所以我这会复习的一个想法就是，能不能存在即使对于实现细节都忘的差不多的情况下，能够依靠知识点链路再一点一点将之推导出来。 而不是靠记忆，记忆是不可靠的，但将知识串成网络后留存在头脑里是可靠的。它能像数学一样，从最简单的几个定理出发，顺着知识链把忘记的知识重新再推导回来。

## 1. call

在上一篇复习this的时候有说到，this的产生本质上是为了函数而服务的，因为它需要指向调用这个函数的对象。

在JS中，众所周知函数被称为一等公民，但实际上真随便找个人问一等公民是什么，很多人是回答不上来的。 

在编程语言的定义中，一等公民指的是它可以作为函数的参数，函数的返回值，还可以赋值给变量。

所以在JS中，不是说只有函数就是一等公民，而是字符串，数字这些基本类型统统都是一等公民，之所以强调函数是一等，是因为很多其他编程语言里，函数不是。

那么JS中函数为什么拥有一等公民的特性，如果有人面试这么问，你应该怎么回答？这就涉及到在JS中函数声明中，函数名会被定义为全局变量，而它的值则是一个函数对象。因为是一个对象，所以才能够赋值给变量，作为属性值和作为函数的参数与返回值。

所以可以简单理解为，函数用来调用的话就是函数，不用来调用的话它其实是个函数对象。

然后再在JS中，在最初的设计里，它就是一门`基于对象`的语言，所谓的基于对象，就是指创造一个对象是基于另一个对象，而这另一个对象被称为该对象的原型。这涉及到了原型方面的知识，在之后里会复习。不过现在就只要理解最简单的一件事就是，类似于星球大战里的克隆人军队，它们是需要一个母体来克隆的，这个克隆的母体在JS中就叫做原型。

而原型一定是一个对象。是对象才能在其中添加属性和方法。

至此才写明白call/apply/bind这类函数是怎么来的，它们统统都是绑定在函数对象的原型上的方法。

我认为知道这点其实是挺重要的，否则对于了解其他语言却不了解JS的程序员来说，下面的代码看着是很奇怪的。给函数上添加属性和方法，并在后续中使用。

```js
function countedHello() {
  console.log("Hello, Xavier!");
  countedHello.callCount++;
  if (countedHello.callCount === 5) {
    countedHello.goodBye()
  } 
}
countedHello.callCount = 0; 
countedHello.goodBye = function() {
	console.log('goodBye, Xavier!')
}

for (var i = 0; i < 5; i++) {
  countedHello();
} 
console.log(countedHello.callCount); 
```

然后回到原型上，call是绑定在原型对象上的方法，作为克隆的母体，我们声明的每一个函数都是克隆体，自然也会携带上该方法。

之所以要设计call方法，就是为了绑定this。this在JavaScript 1.0也就是BE在10天里设计最初版本就已经存在，但后面发现直接使用this会导致一些困惑，所以在JavaScript 1.3版本时添加了call,apply方法用于直接绑定this。之后与JScript统一到ECMA标准里整合为了ES3版本。

所以用一个案例来推导call的实现：
```js
Function.prototype.myCall = function(thisObj) {
  cosole.log('myCall - this', this)
  console.log('myCall - thisObj: ', thisObj)
}

function foo() {
  console.log('foo - this: ', this)
}

foo.call({name: 'xavier'})
foo.myCall({name: 'xavier'})
```

在上述代码里，对于先忽略原生的call函数，而只看最底下自己实现的myCall函数，它并没有完成，不过它获取到了我们之后想要绑定的this对象。并且由于是被foo函数对象所调用，所以myCall函数内部的this指向就是指向foo。 上一篇的文章说过，this指向的一定是个对象。这里就回答了foo在调用其他函数时就是一个对象。

那么就可以继续进行下一步，根据谁调用函数谁就是那个函数的this，就可以很自然的写出下面三行，delete是为了调用完就直接删除属性。
```js
Function.prototype.myCall = function(thisObj) {
  cosole.log('myCall - this', this)
  console.log('myCall - thisObj: ', thisObj)

  var fnObj = this
  thisObj.fnObj = fnObj
  thisObj.fnObj()
  delete thisObj.fnObj
}

function foo() {
  console.log('foo - this: ', this)
}

// foo.call({name: 'xavier'})
foo.myCall({name: 'xavier'})
```

在第一行将this赋值给fnObj，是为了更明确此时在myCall函数被调用时，它的this是一个函数对象，也就是foo。

在第二行将fnObj挂载到thisObj上， 就是指我们想要绑定的this对象上多了一个属性是foo函数对象。

然后第三行通过绑定的this对象来调用foo函数，此刻foo就又成了函数，那么函数调用创建函数指向上下文，this指向就变成了我们指定的thisObj。

执行完成函数后就可以卸载this对象上的属性。 

至此就完成了最重要的一步，就是绑定了this。

但上面的代码会有些问题，因为没法保证想绑定的this一定是一个对象，所以需要对传入的this做一些限制。
```js
Function.prototype.myCall = function(thisObj) {
  cosole.log('myCall - this', this)
  console.log('myCall - thisObj: ', thisObj)

  thisObj = thisObj !== null && thisObj !== undefined ? Object(thisObj) : window
  
  var fnObj = this
  thisObj.fnObj = fnObj
  thisObj.fnObj()
  delete thisObj.fnObj
}

function foo() {
  console.log('foo - this: ', this)
}

// foo.call({name: 'xavier'})
foo.myCall({name: 'xavier'})
```

首先需要判断想绑定的this对象是否为null或者undefined, 如果是，那么就将this对象默认设置为window对象，也就是全局对象。这是在浏览器的环境里。 

如果不是，那么说明this对象存在，但是它有可能是基本类型，以前流传的一句很广的话是说JS中的一切都是对象，这句话就是错的。在JS中基本类型不是对象，所以需要使用Object()包裹一层，使基本类型变成它们的包裹对象。

然后便是call函数的另一个要求，添加相应的参数，并且在函数调用后返回相应的结果。

```js
Function.prototype.myCall = function(thisObj, ...args) {

  thisObj = thisObj !== null && thisObj !== undefined ? Object(thisObj) : window
  
  var fnObj = this
  thisObj.fnObj = fnObj
  var result = thisObj.fnObj(...args)
  delete thisObj.fnObj

  return result
}

function foo() {
  console.log('foo - this: ', this)
}

// foo.call({name: 'xavier'})
foo.myCall({name: 'xavier'})
```

正常主要实现功能的代码就这些，确定this对象，把函数绑在this对象上，然后执行函数，最后解除绑定后返回结果。 

对于边界条件的考虑暂时就没添加，这其实不属于实现问题。以及对于是否只能用ES3里的内容去实现call，我觉得也过于原教旨主义。时代在发展，技术在更新，有更好更便捷的写法就应该用更方便的。

## 2. apply

对于apply来说，其实跟call基本没区别，仅仅只是参数添加修改为数组模式。以及对数组要做个校验。

```js
Function.prototype.myApply = function(thisObj, argsArr) {

  thisObj = thisObj !== null && thisObj !== undefined ? Object(thisObj) : window
  
  argsArr = argsArr || []
  
  if (!Array.isArray(argsArr)) {
    throw new TypeError(`${argsArr} is not a Array`)
  }
  
  var fnObj = this
  thisObj.fnObj = fnObj
  var result = thisObj.fnObj(...argsArr)
  delete thisObj.fnObj

  return result
}

function foo() {
  console.log('foo - this: ', this)
}

foo.myApply({name: 'xavier'}, [1,2,3])
```

## 3. bind

bind函数是在ES5版本也就是09年时才新增的，而不是像call和apply一样，是在ES3中，也就是99年就出现。所以一个新功能的诞生一定是基于有现实意义和需求，我认为最先应该讲述的是它为什么要存在，为解决什么问题而产生。只有这样，哪怕不考虑实现，也能知道自己之后再什么地方能够用到它。

知其然，知其所以然。

在零几年时，JS主要的任务就是用来当做网页的交互的脚本语言，所以经常涉及到了事件相关，比如鼠标点击，键盘输入等。在回调函数里this经常会发生丢失，这是事件循环机制中回调代码会在主代码完成后才在宏任务队列里等待执行导致。在原先的call和apply虽然解决了this绑定的问题，但问题在于它们绑定完会立即执行，而事件机制是需要等待触发在会执行，所以原先的代码就是按这么写：
```html
  <button id="btn">Click</button>
```
```js
var obj = {
  name: 'xavier'
}

function onBtnClick() {
  console.log('my name is ' + this.name)
}

var btn = document.getElementById('btn'); 
btn.addEventListener('click', function() {
  onBtnClick.apply(obj)
}); 
```

每次需要使用时，需要在外面再包一层函数。如果只是一次如此其实也没什么问题，但是事件绑定次次都需要如此，那么必然需要提取出这个函数，封装成一个方法，能够能容易的被使用。
```js
Function.prototype.myBind = function(thisObj) {
  thisObj = thisObj !== null && thisObj !== undefined ? Object(thisObj) : window
  var fnObj = this
  return function() {
    fnObj.apply(thisObj)
  }
}
```

这样在之后每次添加回调函数时，就只需要再对想回调的函数调用上myBind方法，返回一个绑定好this的函数，等到需要执行的时候才会执行。

这就实现了bind所需的第一步。

对于用来回调的函数来说，我们无法保证它是不存在参数的，所以如果要回调一个存在参数的函数，自然在bind方法中也要用于能够传入参数的能力。否则想要回调的函数最终执行的效果就跟我们预想的出现了偏差。
```js
var obj = {
  name: 'xavier'
}

function onBtnClick(age, height) {
  console.log('my name is ' + this.name)
  console.log('my age is ' + age)
  console.log('my height is ' + height)
}

var btn = document.getElementById('btn'); 
btn.addEventListener('click', onBtnClick.myBind(obj)); 
```

因此在设计bind中，一样要添加上能够传参的能力。
```js
Function.prototype.myBind = function(thisObj, ...argsArr) {
  thisObj = thisObj !== null && thisObj !== undefined ? Object(thisObj) : window
  var fnObj = this
  
  function proxyFn() {
    return fnObj.apply(thisObj, ...argsArr)
  }
  
  return proxyFn
}
```

但这只完成了对原函数的参数传入，假如对于新返回的这个函数，我们也需要它有添加新参数的能力呢？ 所以需要对返回的函数在添加上能够新增参数的能力。

```js
Function.prototype.myBind = function(thisObj, ...argsArr) {
  thisObj = thisObj !== null && thisObj !== undefined ? Object(thisObj) : window
  var fnObj = this
  
  function proxyFn(...argsNew) {
    var argsAll = [...argsArr, argsNew]
    return fnObj.apply(thisObj, ...argsAll)
  }
  
  return proxyFn
}
```

对于一个基本符合要求的bind函数就已经算完成。至少在这步上对于原本大多数自己封装函数的程序员来说是没什么问题的，但JS最终实现的bind显然还要更进一步，让bind绑定后返回的函数依旧能够作为构造函数来使用。对于构造函数来说，就涉及到了JS另一个操作符new，它在指定this中的优先级要高于call与apply。因而对于bind指定的this就被new操作指定的this给取代了。

new的实现会在下一节写出，这里需要知道的一个知识点是，当一个函数被new操作符操作后，它所产生的对象，拥有一个隐藏的_proto_属性会指向构造函数的原型。简单但不一定恰当的类比可以理解为能通过基因来溯源祖先。new出的新对象是克隆体，而原型是母体，构造函数就是克隆桥梁。
JS中使用 instanceof 操作符可以用来判断对象的原型链上是否能够找到该对象的原型，也就是克隆体能否找到自己的母体。

```js
function fn() {
  console.log(this instanceof fn)
}

var obj = new fn() // 此时this指向obj, obj是由fn的原型构造出来的，输出true
fn()  // 此时this指向window，window不是由fn的原型构造出来的, 输出false
```

因此在bind函数中添加个instanceof用于判断原型的能力。同时仅仅只是能够判断是否是该原型构造的还不够，还需要能够获取到原型本身能够共享的函数，因而还要加上返回函数的原型链接上原有函数的原型的步骤。

```js
Function.prototype.myBind = function(thisObj, ...argsArr) {
  thisObj = thisObj !== null && thisObj !== undefined ? Object(thisObj) : window
  var fnObj = this
  
  function proxyFn(...argsNew) {
    var argsAll = [...argsArr, argsNew]
    // 当使用new调用时，this指向构造出的新对象，新对象是由fnObj的原型构造出来的
    // 当直接调用函数时，this指向window，因而非构造，所以指向想要绑定的thisObj对象
    return fnObj.apply(this instanceof fnObj ? this : thisObj, ...argsAll)
  }
  
  // 目的是 proxyFn.prototype._proto_ == this.prototype
  var empty = function() {}
  empty.prototype = this.prototype
  proxyFn.prototype = new empty()
  
  return proxyFn
}
```

之所以不直接通过proxyFn.prototype = this.prototype，是因为对于对象来说，对象赋值就是地址赋值，二者会指向同一个对象。这不符合原本设想的存在链式关系，所以需要借用new的能力来创造一个新的对象，并同时这个新的对象会指向函数的原型。

在这里一定要想明白一个点，就是原型就是一个对象。 所有操作都是对象跟对象之间，empty函数只是用来创造一个新对象。这个新对象赋值给了proxyFn函数的原型对象。 而empty函数的原型对象等于之后new出的实例对象的原型对象。 中间形成了一个隐式链接关系。也就是proxyFn原型对象的_proto_属性指向了最终需要实例对象的原型对象。

至此，除去一些边界条件判断， bind函数基本就算完成了。

## 4. new

new这个操作符也是在JavaScript还在命名为Mocha代号时的初代版本就已经设计好的，之所以叫new，就是为了套Java的new。 而Java的new是基于类创建实例对象的工具，JavaScript在设计之初就为了避免与Java竞争，所以早早就定下了是一门基于对象而没有类的语言，因而Js中的new是通过构造函数基于原型链的委托机制而创建对象的。

所以就是仅在外表和名称上，Java和JavaScript的new都是用来实现创建对象的工具，但其根本原理是完全不同的。

通过上面的介绍，其实就可以从new得出三个信息点，那就是，它会创建对象，以及它会跟原型有关系，并且存在构造函数。

首先先理解什么叫构造函数，构造函数就是之前用来类比的克隆桥梁，也可以理解为就像手机一样，一部手机的研发，会首先存在一台原型机。然后通过原型机来制造模具打版，最终批量生产出商品化的手机产品。 这中间的模具打版，就是构造函数。

然后再理解原型，其实原型会在之后复习到，所以在这最简单的提及就是， new的过程本质上是两个对象链接的过程，它们是通过链接而造成看起来像是一个对象创造出了另一个对象。 也就是我们想创建的新对象，链接上原型对象，从而获得原型对象所拥有的属性。然后这样的情况被称为原型继承，但其实是为了贴合Java程序员的理解为称呼的，按照《你不知道的js》和原作者BE都是将之称为对象委托。

从这几点就可以直接写出一个最简单的实现了：
```js
function myNew(ctor, ...args) {
  var obj = {}
  obj.__proto__ = ctor.prototype
  var res = ctor.apply(obj, args)
  return res instanceof Object ? res : obj
}
```

基本内容就是，创建一个新对象，并且把新对象的隐藏[[proto]]属性指向构造函数的原型对象，实现新对象与原型对象的链接。 然后执行构造函数，并且该构造函数里的this指向绑定到新对象上。这里需要一个小的说明，就是Java中的构造函数里的this就是指向它之后创造出的实例对象，所以JavaScript中作为表象，它的形式也是构造函数中的this会指向创建的新对象，所以需要操作this绑定。

接着由于构造函数执行，它是有可能存在返回结果的。正常来说很多其他语言构造函数时不返回值的，只能当构造函数使用。但Js很特别，一个函数在被new操作时，它就是构造函数。不被new操作时，它就是普通函数。作为普通函数，拥有返回结果合情合理。所以new需要对这种情况进行处理，当返回的结果是对象时，返回结果对象，否则就返回新创建的对象。

不过在有对象返回的情况下，其实new操作就跟我们最初预想它要完成的功能就存在偏差了，只是当个普通函数调用返回结果。因而正常用来当构造函数的函数，它确实也不会有返回值。

然后用ES6更简化的写法来实现：
```js
function myNew(ctor, ...args) {
  const newObj = Object.create(ctor.prototype)
  const res = ctor.apply(newObj, args)
  return res instancof Object ? res : newObj
}
```


## 总结

以上只是基于我自身个人对于这几个函数的理解，可能其中存在自身理解不到位的地方而产生些许错误。如看到，望告知。

其实四个函数本身并没有多大的难度，只要对每个知识点都一一踩踏实，掌握this，掌握原型，它们自然而然就能推导的出来。不用刻意去记代码本身是怎么实现的，毕竟实际上这些都是用C++实现，而所有的尝试实现，都只是按照符合函数的功能去写出，每个人有每个人的实现方式。代码多多少少都有些不同。

最根本的还是知其然，知其所以然。





























































