## 1、说明



本格式化指导，使用 AlloyTeam 开发的 eslint-config-alloy，仓库地址为：https://github.com/AlloyTeam/eslint-config-alloy/

其中，代码检查工具为 Eslint ，格式化工具为 Prettier，可以通过此链接查看对哪些内容进行检查 https://alloyteam.github.io/eslint-config-alloy/?language=zh-CN



## 2、使用

### 1、安装 eslint（以下只以 react 项目为例子，其他请查看他们的安装说明）

```
npm install --save-dev eslint babel-eslint eslint-plugin-react eslint-config-alloy
```

### 2、`.eslintrc.js` 和 `.eslintignore`

在你的项目的根目录下创建一个 `.eslintrc.js` 文件，并将以下内容复制进去：

```
module.exports = {
    extends: ["alloy", "alloy/react"],
    env: {
        // 你的环境变量（包含多个预定义的全局变量）
        //
        browser: true,
        node: true,
        // mocha: true,
        // jest: true,
        // jquery: true
    },
    globals: {
        // 你的全局变量（设置为 false 表示它不允许被重新赋值）
        //
        // myGlobal: false
    },
    rules: {
        // 自定义你的规则
    },
};

```

在你的项目的根目录下创建一个 `.eslintignore` 文件，并将以下内容复制进去：

```
dist
```

### 3、安装  Prettier

```
npm install --save-dev --save-exact prettier
```

### 4、`.prettierrc.js` 和 `.prettierignore`

在你的项目的根目录下创建一个 `.prettierrc.js` 文件，并将以下内容复制进去：

```
// .prettierrc.js
module.exports = {
    // 一行最多 120 字符
    printWidth: 120,
    // 使用 2 个空格缩进
    tabWidth: 4,
    // 不使用缩进符，而使用空格
    useTabs: false,
    // 行尾需要有分号
    semi: true,
    // 使用单引号
    singleQuote: false,
    // 对象的 key 仅在必要时用引号
    quoteProps: "as-needed",
    // jsx 不使用单引号，而使用双引号
    jsxSingleQuote: false,
    // 末尾需要有逗号
    trailingComma: "all",
    // 大括号内的首尾需要空格
    bracketSpacing: true,
    // jsx 标签的反尖括号需要换行
    jsxBracketSameLine: false,
    // 箭头函数，只有一个参数的时候，也需要括号
    arrowParens: "always",
    // 每个文件格式化的范围是文件的全部内容
    rangeStart: 0,
    rangeEnd: Infinity,
    // 不需要写文件开头的 @prettier
    requirePragma: false,
    // 不需要自动在文件开头插入 @prettier
    insertPragma: false,
    // 使用默认的折行标准
    proseWrap: "preserve",
    // 根据显示样式决定 html 要不要折行
    htmlWhitespaceSensitivity: "css",
    // vue 文件中的 script 和 style 内不用缩进
    vueIndentScriptAndStyle: false,
    // 换行符使用 lf
    endOfLine: "lf",
    // 格式化嵌入的内容
    embeddedLanguageFormatting: "auto",
};

```



在你的项目的根目录下创建一个 `.prettierignore` 文件，并将以下内容复制进去：

```
## OS
.DS_Store
.idea
.editorconfig
package-lock.json
.npmrc

# Ignored suffix
*.log
*.md
*.svg
*.png
*ignore

## Local
site/vendor
test/base/no-cond-assign/bad.js
test/base/no-irregular-whitespace/bad.js
test/base/no-labels/bad.js
test/base/no-sequences/bad.js
test/base/no-useless-rename/bad.js
test/react/jsx-fragments/bad.js
test/react/self-closing-comp/bad.js
test/vue/no-irregular-whitespace/bad.vue
test/vue/no-irregular-whitespace/good.vue
.husky

## Built-files
.cache
dist

```

### 5、配置项目（ 以vscode为例，其他编辑器请自行搜索配置 ）

在你的项目的根目录下创建一个 `.vscode`文件夹，文件夹下新建  `settings.json` 文件，并将以下内容复制到文件：

```
{
    "files.eol": "\n",
    "editor.tabSize": 4,
    "eslint.autoFixOnSave": true,
    "eslint.validate": [
        {
            "language": "javascript",
            "autoFix": true
        },
        {
            "language": "javascriptreact",
            "autoFix": true
        },
        {
            "language": "vue",
            "autoFix": true
        },
        {
            "language": "typescript",
            "autoFix": true
        },
        {
            "language": "typescriptreact",
            "autoFix": true
        }
    ],
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[vue]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[javascriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },

}

```

