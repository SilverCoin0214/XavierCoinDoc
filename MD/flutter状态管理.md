# 1. InheriteWidget

```dart
class SceInherite extends InheriteWidget{
	
	SceInherite({Key? key, required this.child}) : super(key: key, child: child);

  final Widget child;

  static SceInherite of(BuildContext context) {
    // 沿着element树去找到最近的 SceInheriteElement, 从element中取出widget对象
    return context.dependOnInheritedWidgetOfExactType<SceInherite>();
  }
  
	@override
  bool updateShouldNotify(SceInherite oldWidget) {
    // 更新的时候是否做一个通知, 在依赖当期inheriteWidget的statefulWidget组件中 didChangeDependencies 方法
    return true;
  }
}
```

# 2. provider

###1. 创建自己需要共享的数据

### 2. 在应用程序顶层 创建 ChangeNotifierProvider

### 3. 在其他位置使用共享的数据

#### 3.1 provider.of : 当provider中的数据改变时, 调用的组件里的build方法都会重新创建

#### 3.2 consumer: 当provider中的数据改变时, 只会更新consumer的 builder

#### 3.3 selector: 1. 对原有类型做一个转换,  2.  shouldRebuild(prev, next) => false, 