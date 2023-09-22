## 函数类型表达式
```ts
type GreetFunction = (a: string) => void
function greeter(fn: GreetFunction) {
	fn("hello world")
}
```

## 调用签名
函数除了可以被调用，也可以存在自己的属性。
```ts
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};

function doSomething(fn: DescribableFunction) {
  console.log(fn.description + 'returned' + fn(6))
}
```

## 构造签名
函数也可以使用new调用， 构造签名就是在调用签名签名加一个new
```js
type SomeConstructor = {
  new (s: string): Object;
}

function fn(ctor: SomeConstructor) {
  return new ctor('hello')
}
```

## 泛型函数

```ts
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0]
}

const s = firstElement(['a', 'b', 'c'])
```

## 泛型推断
```ts
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
  return arr.map(func)
}

const parsed = map(['1', '2', '3'], (n) => parseInt(n))
```

## 约束
```ts
function longest<Type extends {length: number}>(a: Type, b: Type) {
	if (a.length >= b.length) {
		return a
	} else {
		return b
	}
}

const longArray = longest([1,2], [1,2,3])
const longString = longest('alic', 'bob')
```

## 函数重载

```js
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
	if (d !== undefined && y != undefined) {
		return new Date(y, mOrTimestamp, d)
	} else {
		return new Date(mOrTimestamp)
	}
}

const d1 = makeDate(1245343)
const d2 = makeDate(5,5,5)
const d3 = makeDate(123,23)
```



