# 前端通关手册: Javascript

## Javascript

### ES3

#### 1. a = []，a.push(...[1, 2, 3]) ，a = ？

```
自答: 
	数组解构
	a = [1,2,3]

答案:
	a = [1, 2, 3]，考核点如下：

[].push：调用数组 push 方法
apply：
	第一参数：指定 push 执行时的 this，即正在调用 push 的对象为数组 a
	第二参数：传入数组或类数组对象作为参数数组，展开作为 push 的参数列表
push的语法：支持将一个或多个元素添加到数组末尾
```

#### 2. a = ?, a==1 && a==2 && a==3 成立

```
自答:
	隐式转换
	1. a = true
	2. a = {
		num: 1,
		valueOf() {
			return this.num++
		}
	}
	
答案:
	1. 对象转字符串： 先toString(), 再valueOf()
	2.对象转数字： 先valueOf() 或者 toString() + valueOf()
	3.对象转布尔， True
	4.数组转对象： 符合对象规律，不过toString()里面会调用join()方法
可以直接在定义处重写方法
```

#### 3. null == undefined 结果

```
自答:
	true
	隐转里的定义: 在 == 比较中, null 与 undefined是一回事, 与自身相等, 与对方相等. 
	
答案:
	比较 null 和 undefined 的时候，不能将 null 和 undefined 隐式转换，规范规定结果为相等
```



