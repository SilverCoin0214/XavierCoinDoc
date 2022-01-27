## 1. Animation: 抽象类

- 监听动画值的改变
- 监听动画状态的改变
- value
- status

## 2. AnimationController继承自Animation

- Vsync: 同步信号 (this => with SingleTickerProviderStateMixin)
- Forwart(): 向前执行动画
- Reverse(): 反转执行动画

## 3. CurvedAnimation

- 作用: 设置动画执行的速率(速度曲线)

## 4. Tween: 设置动画执行value的范围

- Begin: 开始值
- End: 结束值



动画步骤

1. 创建AnimationController

    _controller = AnimationController(

    ​	vsync: this,

    ​	duration: Duration(seconds: 1)

    )

2. 设置Curve的值

    animation = CurvedAnimation(parent: _controller, curve: Curves.elasticInOut)

3. Tween

    sizeAnim = Tween(begin: 50, end: 150).animate(animation)

4. 监听动画值的改变