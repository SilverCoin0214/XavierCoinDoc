## 关键术语

HTML上大多数元素都可以是Flex容器。

### 注意点：
1. **HTML 中的可替代元素是无法成为 Flex 容器的，比如`img`、 `input`、 `select`等元素**
2. **在 Flexbox 布局中， Flex 容器和 Flex 项目之间的关系永远是父子关系。**
3. Flexbox 中的主轴由 `flex-direction` 属性设置，默认情况下，主轴沿行方向（内联轴 Inline Axis）分布
4. Flexbox 布局中的主轴、主方向、侧轴和侧方向不是固定不变的，它们会随着`writing-mode`（书写模式）和 `direction`（阅读方向）而改变。
5. 主轴尺寸和侧轴尺寸可以用来决定一个 Flex 容器的大小。但它们并不完全等同于 Flex 容器的宽高（`width x height` ）。 因为有方向性。
6. **如果需要显式设置 Flex 容器尺寸的话，使用逻辑属性** **`inline-size`** **或** **`block-size`** **更符合多语言的 Web 布局！**

## 相关特性

#### **Flex 容器**上的属性
- flex-direction
- flex-wrap
- justify-content
- align-content
- align-items
- gap
![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202301301617876.png)

#### **Flex 项目**上的属性
- order： 为Flex 容器中的项目重新排序
- flex-grow
- flex-shrink
- flex-basis
- flex
- align-self
![](https://raw.githubusercontent.com/SilverCoin0214/XavierCoinPic/main/image/%08js/202301301618667.png)


### 注意点：
1. 如果 Flex 容器没有足够多的空间，Flex 项目在溢出之前，每一个 Flex 项目将会尽可能缩小到其最小内容（`min-content`）的尺寸。即 **Flex 项目一旦达到最小内容（`min-content`）大小， Flex 项目将开始溢出 Flex 容器** ！
2. Flex 容器在换行后会创建多个 **Flex 行** 。在空间分布方面，每一行就像一个新的 Flex 容器。因此，如果你要换行，则无法让第 2 行中的某些内容与它上面第 1 行中的某些内容对齐。

## 对齐方式

用于分配 Flex 容器空间的属性主要有：
-   `justify-content`：沿 Flex 容器的主轴分配 Flex 容器的剩余空间；
-   `align-content`：沿 Flex 容器的侧轴分配 Flex 容器的剩余空间；
-   `place-content`：它是 `justify-content` 和 `align-content` 的简写属性。

用于在 Flexbox 布局中对齐的属性如下：
-   `align-self`：沿 Flex 容器侧轴对齐单个 Flex 项目；
-   `align-items`：将所有 Flex 项目作为一个组，沿 Flex 容器侧轴对齐。

`justify-` 开头的属性主要用于 Flex 容器的主轴方向；`align-` 开头的属性主要用于 Flex 容器侧轴方向；`-items` 结尾的属性主要用于对齐 Flex 项目，`-self` 结尾的属性主要用于 Flex 项目的自对齐，`-content` 结尾的属性主要用于容器空间分配。

### 注意点：
1. 事实上，不管 `flex-direction` 属性的值是什么，`justify-content` 属性**只作用于 Flex 容器主轴上，它会让 Flex 项目在主轴上进行排列或分配主轴方向的 Flex 容器剩余空间** 。
2. Flexbox 布局中的 `align-content` 属性值和 `justify-content` 属性值相比多出了一个 `stretch` 值。
3. 在 Flexbox 布局中，你可以使用 `place-content: center` 构建一个**水平垂直居中** 的布局效果
4. **`align-content`** **只有当** **`flex-wrap`** **属性的值为非** **`nowrap`** **（即** **`wrap`** **或** **`wrap-reverse`** **）时才能生效** 。
5. **当 Flex 容器有多行出现时，使用** **`align-items: center`** **无法让它们在 Flex 容器中垂直居中（只能在所在 Flex 行中垂直居中）**


通过前面内容的学习，我想大家对 Flex 项目中的对齐属性有了一定的了解：

-   可用于 Flex 容器的属性有 `justify-content` 、`align-content` 和 `align-items`；
-   可用于 Flex 项目的属性有 `align-self` 和 `margin: auto`；
-   Flexbox 布局中的溢出对齐 `safe` 和 `unsafe` ；
-   Flexbox 布局中没有 `justify-items` 和 `justify-self` 属性。



