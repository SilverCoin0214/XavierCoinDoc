## 前言

对于Promise，其实我一直没想好要复习的话，应该要复习什么东西，以及最终输出什么。

实际在工作中写业务里，大多数都直接用到了async/await的语法，对于直接写promise是少之又少，以至于这块知识一直浮于知识面上。类似Promise/A+规范之类的实现，在几年前也写过几次，以至于后面写的都像背下来了一样，但主要过个一段时间，就又都忘的七七八八了。

所以其实在我感受里，会实现Promise，也并不代表掌握了Promise，甚至很可能只是像我以前一样只是记着了怎么实现。真正在实际需求中，反而是第一时间想不到使用Promise，又或者是想到了但是没法正确的用Promise实现要求的。

就我自身目前的问题来说，就是对于Promise相关的知识脉络是清晰的，出一道关于Promise综合题最终输出的顺序和结果之类的，基本都是没什么问题的，但通过要求使用Promise实现一些需求的时候，通常没有办法一次性正确的实现。 这就表明其实并没有真正完全掌握如何运用Promise，这回复习的主要目的也就在于此。

希望与我有类似问题的人能在读完文章之后一些启发和帮助。

## 前提知识

### 2. 1 事件循环

现在并不需要很详细的了解事件循环的所有知识，只需要知道对于JS脚本来说，它是遵循着事件循环的机制执行的。在主流程代码执行完毕后，即进入事件循环中，遵循着微任务队列和宏任务队列两个队列依照一定的规则运行。

首先主流程代码并不在事件循环中，但是可以将之视为一个宏任务，在它执行时，遇到微任务会将微任务放入微任务队列，遇到宏任务会放入宏任务队列。  所以在主流程代码执行完时， 微任务队列和宏任务队列都会存在有相应的任务。 而事件循环首先开始执行的是 微任务队列，需要先把微任务队列里所有的任务都执行完毕后，才会在宏任务队列里执行下一个宏任务，然后这个宏任务执行完后，又会转入微任务队列查看是否存在微任务，存在则继续执行清空微任务队列，然后在去执行宏任务队列里的下一个宏任务。 这里仅讨论微任务和宏任务的顺序，浏览器其他跟事件循环相关的内容先略去。

用一个生活化的例子来比喻就是， 在我们玩游戏时，一个主线任务可能在玩的过程中会存在分支任务，当我们完成了一个主线任务后，必须先继续完成所有这个主线任务产生的分支任务后。才可以进入下一个主线任务。  这里的主线任务就类比于宏任务，而分支任务类比为微任务。

而Promise.then()就属于微任务，要记住不是new Promise属于微任务，而是Promise.then()。
然后关于主流程可以视为宏任务，setTimeout, setInterval等是宏任务。

暂时只需要这么多即可。

### 2.2 Promise相关知识点

其实对于Promise的知识点，基本就是提及一遍规范内容。对于完全知晓的其实并不需要看。

1. promise有3种状态，分别是pending, fulfilled和rejected。pending是等待状态，它可以变成fulfilled完成状态和rejected失败状态，但状态一经改变，就不会再有变化。 
2. fulfilled存在一个不可变的value, rejected存在一个不可变的reason
3. promise存在一个then方法，接受onFulfilled和onRejected参数， 返回值是一个新的Promise，即使没有设置返回也会返回一个Promise,但是这个Promise没有返回值，所以会是undefined。 then方法是在调用它的promise状态已经完成后才会放到微任务队列中。
4. promise的then方法可以调用多次，但是promise状态已经完成后，不论调用多少次then方法，获取的值都是相同的。
5. promise的非promise返回值都会被包装成promise。
6. catch方法实际就是then方法置空onFulfilled参数得来的，所以它有then方法相关的特性，并且catch不管连接在哪里，都能获取到之前未捕捉到的错误。
7. then和catch中返回值是一个error并不会报错，也不会被之后的catch捕获。而是包装成promise，进入到下一个then方法里。
8. then和catch期望的参数是函数，如果不是函数，则会发生值透传，也就是直接跳过它们，直到存在能被接受的函数时。
9. finally方法是接在所有promise之后的最后方法，不论之前promise状态如何都会执行，并且它返回的会是上一次promise的值，除非抛出的是异常promise。
10. 多个promise产生的链式调用，并不是一个Promise的链式执行完再到下一个promise,而是依据事件循环里微任务队列里依次压入微任务，然后同一优先级的微任务执行完后再执行之后的微任务。
11. promise.all和promise.race两个静态方法都是传入一个promise数组，前者并行执行等到所有状态都确定时进入then方法，后者并行执行时只产生第一个状态确定时就进入then，但余下的promise也会执行完毕，只是返回的结果不会使用。

## 案例

先给一道要求输出的综合题吧，很多面试会喜欢给这类题问输出顺序，基本考察对Promise顺序的掌握，其实也就是事件循环的掌握，我试着用画图的模式给一份解答。
```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
  
  // 等价
  // console.log("async1 start");
  // new Promise((reslove, reject) => {
  //   async2()
  //   reslove()
  // }).then(res => console.log("async1 end"))
}

async function async2() {
  console.log("async2");
}

console.log("script start");

setTimeout(function() {
  console.log("setTimeout");
}, 0);

async1();

new Promise(function(resolve) {
  console.log("promise1");
  resolve();
}).then(function() {
  console.log("promise2");
});
console.log('script end')
```

#### 1. 主流程代码
全局代码首先碰到两个函数跳过，然后执行输出语句，碰到setTimeout语句将回调函数丢入宏任务队列， 然后执行async1函数，执行输出后执行async2函数， 并在await处停下，将await下面的部分丢入微任务队列变成Promise1。 跳出函数后执行最底下的promise， 并把之后的.then函数丢入微任务队列变成promise2， 执行最后的输出语句。

所以图里的过程就是：

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202212191438961.png)

碰到 setTimeout 函数：

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202212191440900.png)

碰到 async1函数, 执行输出语句，并执行async2函数后, 到了await处以下当做promise处理：

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202212191443151.png)

退出函数，碰到新的promise, 执行new Promise内部，并将then函数放入微任务：

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202212191446221.png)

执行最后的输出语句：

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202212191447183.png)

#### 2. 进入微任务队列处理

全局代码完成后，就进入微任务队列， 该队列目前存在两个promise, 所以按顺序执行两个promise

先执行第一个promise，也就是await之后的代码：

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202212191451352.png)

然后执行第二个promise，也就是then函数：

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202212191452272.png)

#### 3. 进入宏任务队列处理

当微任务队列都被清空后，进入宏任务队列， 处理其中的回调函数：

![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202212191454933.png)


至此所有代码都已经完成，所以最终的结果就是：

```js
'script start'
'async1 start'
'async2'
'promise1'
'script end'
'async1 end'
'promise2'
'setTimeout'
```

对于这种流程题来说，只要掌握了事件循环的输出顺序，几乎毫无难度。

## 案例2

但对于真正使用promise来说，其实肯定还是需要自己动手编码promise相关的代码才是说明掌握了使用的方法。 

同样是给出一些面试类似的题目，主要是分析思考的过程，真正的答案并不是很重要，每个人都有每个人的写法。

#### 使用Promise实现每隔1秒输出1,2,3
