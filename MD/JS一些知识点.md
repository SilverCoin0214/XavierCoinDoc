### 1. undeclared 与 undefined 的区别？

自答:

- undeclared 指的是 变量未被声明和初始化就使用, 是一个未知未声明的东西.
- undefined 指的是 变量已经被创建, 并且初始化为了undefined. 

### 2. let & const 与 var 的区别?

自答:

- let与const 在词法环境中被创建,  var 在变量环境中被创建
- let 与 const 存在词法作用域, 而 var 没有
- Var let const 都存在变量提升, 但是 var 是在创建的同时进行初始化, 以至于在作用域内任何位置都可以被调用, 而let 与 const则单纯只做了创建而没有被初始化, 因而在声明之前是无法被调用的, 
- var 可以重复声明变量, let 与 const 无法重复声明同一变量

### 3. 暂时性死区问题

自答:

​	当在作用域内部使用 let 与 Const 时就可能存在暂时性死区, 根本原因在于声明的变量实际在内存中是在js定义的词法环境里, 仅仅只是执行了创建, 而没有进行初始化. 因而在声明之前是无法获取到的, 对于执行的代码而言还是无法识别的.  只有到声明的位置, 才在内存中进行了初始化. 从而可以获取变量的值. 

### 4. 获取DOM元素有哪些方法

自答:

1. getElementById
2. getElementByClassName
3. getElementByName

答案:

| 方法                                   | 描述                      | 返回类型                          |
| -------------------------------------- | ------------------------- | --------------------------------- |
| document.getElementById(id)            | 通过id获取dom             | 符合条件的dom对象                 |
| document.getElementsByTagName(tagName) | 通过标签名获取dom         | 符合条件的所有dom对象组成的类数组 |
| document.getElementsByClassName(class) | 通过class获取dom          | 符合条件的所有dom对象组成的类数组 |
| document.getElementsByName(name)       | 通过标签的属性name获取dom | 符合条件的所有dom对象组成的类数组 |
| document.querySelector(选择器)         | 通过选择器获取dom         | 符合条件的第一个dom对象           |
| document.querySelectorAll(选择器)      | 通过选择器获取dom         | 符合条件的所有dom对象组成的类数组 |



### 5. 操作DOM元素有哪些方法

自答:

1. getAttribute  获取属性
2. appendChild 增加子节点
3. createElement 创建节点
4. ....

答案:

| 标题                   | 描述                                                         |
| ---------------------- | ------------------------------------------------------------ |
| createElement          | 创建一个标签节点                                             |
| createTextNode         | 创建一个文本节点                                             |
| cloneNode(deep)        | 复制一个节点，连同属性与值都复制，deep为true时，连同后代节点一起复制，不传或者传false，则只复制当前节点 |
| createDocumentFragment | 创建一个文档碎片节点                                         |
| appendChild            | 追加子元素                                                   |
| insertBefore           | 将元素插入前面                                               |
| removeChild            | 删除子元素                                                   |
| replaceChild           | 替换子元素                                                   |
| getAttribute           | 获取节点的属性                                               |
|  createAttribute						| 创建属性   |
| 	setAttribute 							|  设置节点属性 | 
| romoveAttribute	 | 删除节点属性 | 
| element.attributes | 将属性生成类数组对象 |



### 6. DOM的类型有哪几种?

自答:

1. 根节点
2. 文本节点
3. 元素节点
4. ...

答案:

12种

```
元素节点            　　Node.ELEMENT_NODE(1)
属性节点            　　Node.ATTRIBUTE_NODE(2)
文本节点            　　Node.TEXT_NODE(3)
CDATA节点             Node.CDATA_SECTION_NODE(4)
实体引用名称节点    　　 Node.ENTRY_REFERENCE_NODE(5)
实体名称节点        　　Node.ENTITY_NODE(6)
处理指令节点        　　Node.PROCESSING_INSTRUCTION_NODE(7)
注释节点            　 Node.COMMENT_NODE(8)
文档节点            　 Node.DOCUMENT_NODE(9)
文档类型节点        　　Node.DOCUMENT_TYPE_NODE(10)
文档片段节点        　　Node.DOCUMENT_FRAGMENT_NODE(11)
DTD声明节点            Node.NOTATION_NODE(12)
```



### 7. JS的作用域以及作用域链

自答:

