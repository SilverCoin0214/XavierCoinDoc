### 前言

最近有个需求是人工语音播放时文本能随语音朗读时像歌词滚动的效果. 

原本第一考虑的时能随时间字体渐变成更改后的颜色, 有比较流畅的走马灯效果. 但最终实践了几次后发现要能够逐字逐行渐变有一些麻烦, 不好实现.  

所以转而变为将字体直接将字体高亮,  一段文本区分成两个部分, 一个部分是高亮文本, 也就是已朗读的部分, 一个部分是剩下未朗读的非高亮文本. 通过时时渲染页面就能达成滚动高亮的效果.


---

### 功能实现

因为在`Text`中会存在两段文本, 所以就不能单只用`Text`组件, 而改用`Text.rich`. 通过`textSpan`生成一个数组然后放到`text.rich`中. 
所以本文需要处理, 而不是自己一个个拼接, 所以需要先有一个解析的类来负责处理.

需要在项目中加入第三方插件 `string_scanner` 用于扫描文本.

```dart
class StringParser {
  // 导入的文本
  final String content;
  // 高亮部分尾部索引, 也就是两段的区分位置
  final int endIndex;

  StringParser({required this.content, required this.endIndex});

  late StringScanner _scanner;

  // 解析函数
  InlineSpan parser() {
    _scanner = StringScanner(content);

    parseContent();

    final List<InlineSpan> spans = [];

    int currentPosition = 0;

    // 需要高亮的部分
    spans.add(TextSpan(style: _spans.style, text: _spans.text(content)));
    currentPosition = _spans.end;

    // 未高亮的部分
    if (currentPosition != content.length) {
      spans.add(
          TextSpan(text: content.substring(currentPosition, content.length)));
    }

    return TextSpan(style: TextStyleSupport.defaultStyle, children: spans);
  }

  late SpanBean _spans;

  // 解析需要变成高亮的字符
  void parseContent() {
    int startIndex = 0;

    _spans = SpanBean(startIndex, endIndex);

    if (!_scanner.isDone) {
      _scanner.position++;
    }
  }
}
```

之后需要定义一个高亮的数据类型, 用于方便修改之后想要高亮的文本样式和默认样式. 

```dart
class SpanBean {
  SpanBean(this.start, this.end);

  final int start;
  final int end;

  String text(String src) {
    return src.substring(start, end);
  }

  TextStyle get style => TextStyleSupport.highLightStyle;
}

class TextStyleSupport {
  static const defaultStyle = TextStyle(color: Colors.black, fontSize: 36);
  static const highLightStyle = TextStyle(color: Colors.green, fontSize: 36);
}

```


至此文本高亮和非高亮处理完成, 只需要在文件中导入后使用.  
滚动效果则需要实现一个`play`函数里通过 `Future.delayed`来控制延时递归执行. 

```dart
_starPlay(flag) {
	// flag用于判断是 执行还是暂停
    if (this.endIndex == content.length + 1 || !flag) {
      return;
    }

    parser = StringParser(content: content, endIndex: this.endIndex++);
    span = parser.parser();

    setState(() {});
    Future.delayed(Duration(milliseconds: 100)).then((value) {
      _starPlay(this.flag);
    });
  }
```

最终在文件里的代码则是
```dart
import 'package:flutter/material.dart';
import 'StringParser.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key? key}) : super(key: key);
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  late InlineSpan span;

  final String content =
      """一点不错，”狐狸说。“对我来说，你还只是一个小男孩，就像其他千万个小男孩一样。我不需要你。你也同样用不着我。对你来说，我也不过是一只狐狸，和其他千万只狐狸一样。但是，如果你驯服了我，我们就互相不可缺少了。对我来说，你就是世界上唯一的了；我对你来说，也是世界上唯一的了。""";

  late StringParser parser;
  int endIndex = 0;
  bool flag = true;

  @override
  void initState() {
    super.initState();
    parser = StringParser(content: content, endIndex: endIndex);
    span = parser.parser();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text("滚动高亮文本"),
          actions: [
            ElevatedButton(
                onPressed: () {
                  this.flag = true;
                  _starPlay(flag);
                  print('开始');
                },
                child: Text("开始")),
            ElevatedButton(
                onPressed: () {
                  this.flag = false;
                  // _starPlay(flag);
                  print('暂停');
                },
                child: Text("暂停"))
          ],
        ),
        body: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Text.rich(span),
        ));
  }

  _starPlay(flag) {
    if (this.endIndex == content.length + 1 || !flag) {
      return;
    }

    parser = StringParser(content: content, endIndex: this.endIndex++);
    span = parser.parser();

    setState(() {});
    Future.delayed(Duration(milliseconds: 100)).then((value) {
      _starPlay(this.flag);
    });
  }
}
```


实现效果: