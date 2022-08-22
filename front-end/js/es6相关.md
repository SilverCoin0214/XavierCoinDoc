## Let - Const

## let, const和window关系
- var声明的变量会绑定到 window上.
- Let, const声明的则不会.
- var, let, const都已经保存在 变量环境VE中, 保存在variableMap中, 它本质是一个哈希表
- window这个变量是浏览器提供的, 而变量环境这些是v8引擎提供的.  目前var依旧绑定在window上属于历史遗留做兼容.  早期还是GO对象时, window=GO, 所以导致var会同时绑定在window中.