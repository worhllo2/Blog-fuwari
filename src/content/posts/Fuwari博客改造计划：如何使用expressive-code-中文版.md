---
title: Fuwari 博客改造计划：如何使用 Expressive Code
published: 2026-04-03
description: 探索如何在 Markdown 中使用 Expressive Code 增强代码块显示效果。
tags: [Markdown, 博客, 教程]
category: 教程
draft: false
---

在这篇文章中，我们将探索如何使用 [Expressive Code](https://expressive-code.com/) 来增强 Markdown 中的代码块显示。以下示例基于官方文档，您可以查阅文档以获取更多详细信息。

## 1. 语法高亮 (Syntax Highlighting)

Expressive Code 提供了强大的[语法高亮](https://expressive-code.com/key-features/syntax-highlighting/)功能。

#### 常规语法高亮
```js
console.log('这段代码具有语法高亮！')
```

#### 渲染 ANSI 转义序列
```ansi
ANSI 颜色示例:
- 标准: [31m红色[0m [32m绿色[0m [33m黄色[0m [34m蓝色[0m [35m洋红[0m [36m青色[0m
- 加粗: [1;31m红色[0m [1;32m绿色[0m [1;33m黄色[0m [1;34m蓝色[0m [1;35m洋红[0m [1;36m青色[0m
- 变暗: [2;31m红色[0m [2;32m绿色[0m [2;33m黄色[0m [2;34m蓝色[0m [2;35m洋红[0m [2;36m青色[0m

256 色 (显示 160-177):
[38;5;160m160 [38;5;161m161 [38;5;162m162 [38;5;163m163 [38;5;164m164 [38;5;165m165[0m
[38;5;166m166 [38;5;167m167 [38;5;168m168 [38;5;169m169 [38;5;170m170 [38;5;171m171[0m
[38;5;172m172 [38;5;173m173 [38;5;174m174 [38;5;175m175 [38;5;176m176 [38;5;177m177[0m

全 RGB 颜色:
[38;2;34;139;34m森林绿 - RGB(34, 139, 34)[0m

文本格式: [1m加粗[0m [2m变暗[0m [3m斜体[0m [4m下划线[0m
```

## 2. 编辑器与终端外框 (Editor & Terminal Frames)

[编辑器与终端外框](https://expressive-code.com/key-features/frames/)

#### 代码编辑器外框
```
```js title="my-test-file.js"
console.log('带有标题属性的示例')```
```


```js title="my-test-file.js"
console.log('带有标题属性的示例')
```

---

```
```html  <!-- src/content/index.html -->
<div>通过注释指定文件名的示例</div>```
```

```html
<!-- src/content/index.html -->
<div>通过注释指定文件名的示例</div>
```
---

#### 终端外框

```
```bash
echo "这个终端外框没有标题"```
```

```bash
echo "这个终端外框没有标题"
```

---

```
```powershell title="PowerShell 终端示例"
Write-Output "这个带有一个标题！"```
```

```powershell title="PowerShell 终端示例"
Write-Output "这个带有一个标题！"
```

#### 覆盖外框类型

```
```sh frame="none"
echo "看，没有任何外框！"```
```

```sh frame="none"
echo "看，没有任何外框！"
```

---

```
```ps frame="code" title="PowerShell Profile.ps1"
# 如果不手动覆盖，这通常会被自动识别为终端外框
function Watch-Tail { Get-Content -Tail 20 -Wait $args }
New-Alias tail Watch-Tail```
```

```ps frame="code" title="PowerShell Profile.ps1"
# 如果不手动覆盖，这通常会被自动识别为终端外框
function Watch-Tail { Get-Content -Tail 20 -Wait $args }
New-Alias tail Watch-Tail
```

## 3. 文本与行标记 (Text & Line Markers)

[文本与行标记](https://expressive-code.com/key-features/text-markers/)

#### 标记整行或行范围

```
```js {1, 4, 7-8}
// 第 1 行 - 通过行号标记
// 第 2 行
// 第 3 行
// 第 4 行 - 通过行号标记
// 第 5 行
// 第 6 行
// 第 7 行 - 通过范围 "7-8" 标记
// 第 8 行 - 通过范围 "7-8" 标记```
```

```js {1, 4, 7-8}
// 第 1 行 - 通过行号标记
// 第 2 行
// 第 3 行
// 第 4 行 - 通过行号标记
// 第 5 行
// 第 6 行
// 第 7 行 - 通过范围 "7-8" 标记
// 第 8 行 - 通过范围 "7-8" 标记
```

#### 选择行标记类型 (mark, ins, del)

```
```js title="line-markers.js" del={2} ins={3-4} {6}
function demo() {
  console.log('这一行被标记为已删除')
  // 这一行和下一行被标记为已插入
  console.log('这是第二个插入行')

  return '这一行使用中性的默认标记类型'
}```
```

```js title="line-markers.js" del={2} ins={3-4} {6}
function demo() {
  console.log('这一行被标记为已删除')
  // 这一行和下一行被标记为已插入
  console.log('这是第二个插入行')

  return '这一行使用中性的默认标记类型'
}
```

#### 为行标记添加标签

```
```jsx {"1":5} del={"2":7-8} ins={"3":10-12}
// labeled-line-markers.jsx
<button
  role="button"
  {...props}
  value={value}
  className={buttonClassName}
  disabled={disabled}
  active={active}
>
  {children &&
    !active &&
    (typeof children === 'string' ? <span>{children}</span> : children)}
</button>```
```

```jsx {"1":5} del={"2":7-8} ins={"3":10-12}
// labeled-line-markers.jsx
<button
  role="button"
  {...props}
  value={value}
  className={buttonClassName}
  disabled={disabled}
  active={active}
>
  {children &&
    !active &&
    (typeof children === 'string' ? <span>{children}</span> : children)}
</button>
```

#### 添加长标签

```
```jsx {"1. 在这里提供 value 属性:":5-6} del={"2. 移除 disabled 和 active 状态:":8-10} ins={"3. 添加此项以在按钮内渲染子元素:":12-15}
// labeled-line-markers.jsx
<button
  role="button"
  {...props}

  value={value}
  className={buttonClassName}

  disabled={disabled}
  active={active}
>

  {children &&
    !active &&
    (typeof children === 'string' ? <span>{children}</span> : children)}
</button>```
```

```jsx {"1. 在这里提供 value 属性:":5-6} del={"2. 移除 disabled 和 active 状态:":8-10} ins={"3. 添加此项以在按钮内渲染子元素:":12-15}
// labeled-line-markers.jsx
<button
  role="button"
  {...props}

  value={value}
  className={buttonClassName}

  disabled={disabled}
  active={active}
>

  {children &&
    !active &&
    (typeof children === 'string' ? <span>{children}</span> : children)}
</button>
```

#### 使用类似 Diff 的语法

```
```diff
+这一行将被标记为已插入
-这一行将被标记为已删除
这是一行普通代码```
```

```diff
+这一行将被标记为已插入
-这一行将被标记为已删除
这是一行普通代码
```

---

```
```diff
--- a/README.md
+++ b/README.md
@@ -1,3 +1,4 @@
+这是一个真实的 diff 文件示例
-所有内容都将保持原样
 连空格也不会被移除```
```


```diff
--- a/README.md
+++ b/README.md
@@ -1,3 +1,4 @@
+这是一个真实的 diff 文件示例
-所有内容都将保持原样
 连空格也不会被移除
```

#### 将语法高亮与 Diff 语法结合

```
```diff lang="js"
  function thisIsJavaScript() {
    // 整个代码块按 JavaScript 高亮，
    // 同时我们仍然可以添加 diff 标记！
-   console.log('旧的代码将被移除')
+   console.log('全新的闪亮代码！')
  }```
```

```diff lang="js"
  function thisIsJavaScript() {
    // 整个代码块按 JavaScript 高亮，
    // 同时我们仍然可以添加 diff 标记！
-   console.log('旧的代码将被移除')
+   console.log('全新的闪亮代码！')
  }
```

#### 标记行内的特定文本

```
```js "指定文本"
function demo() {
  // 标记行内任何出现的“指定文本”
  return '支持多次匹配指定文本';
}```
```

```js "指定文本"
function demo() {
  // 标记行内任何出现的“指定文本”
  return '支持多次匹配指定文本';
}
```

#### 正则表达式

```
```ts /ye[sp]/
console.log('单词 yes 和 yep 都将被标记。')```
```

```ts /ye[sp]/
console.log('单词 yes 和 yep 都将被标记。')
```

#### 标记行内标记类型 (mark, ins, del)

```
```js "return true;" ins="inserted" del="deleted"
function demo() {
  console.log('这些是 inserted 和 deleted 标记类型');
  // return 语句使用默认标记类型
  return true;
}```
```

```js "return true;" ins="inserted" del="deleted"
function demo() {
  console.log('这些是 inserted 和 deleted 标记类型');
  // return 语句使用默认标记类型
  return true;
}
```

## 4. 自动换行 (Word Wrap)

[自动换行](https://expressive-code.com/key-features/word-wrap/)

#### 为单个代码块配置换行

```
```js wrap
// 开启换行的示例
function getLongString() {
  return '这是一段非常长的字符串，如果不开启自动换行，它很可能超出现在容器的显示范围，除非容器极宽。'
}```
```

```js wrap
// 开启换行的示例
function getLongString() {
  return '这是一段非常长的字符串，如果不开启自动换行，它很可能超出现在容器的显示范围，除非容器极宽。'
}
```

---

```
```js wrap=false
// 关闭换行的示例 (wrap=false)
function getLongString() {
  return '这是一段非常长的字符串，如果不开启自动换行，它很可能超出现在容器的显示范围，除非容器极宽。'
}```
```


```js wrap=false
// 关闭换行的示例 (wrap=false)
function getLongString() {
  return '这是一段非常长的字符串，如果不开启自动换行，它很可能超出现在容器的显示范围，除非容器极宽。'
}
```

#### 配置换行后的缩进

```
```js wrap preserveIndent
// 保持缩进示例 (默认开启)
function getLongString() {
  return '长字符串换行后会保持与上一行相同的缩进位置。'
}```
```

```js wrap preserveIndent
// 保持缩进示例 (默认开启)
function getLongString() {
  return '长字符串换行后会保持与上一行相同的缩进位置。'
}
```

---

```
```js wrap preserveIndent=false
// 关闭保持缩进示例 (preserveIndent=false)
function getLongString() {
  return '长字符串换行后将不再保持缩进，而是从行首开始。'
}```
```


```js wrap preserveIndent=false
// 关闭保持缩进示例 (preserveIndent=false)
function getLongString() {
  return '长字符串换行后将不再保持缩进，而是从行首开始。'
}
```

## 5. 可折叠代码段 (Collapsible Sections)

[可折叠代码段插件](https://expressive-code.com/plugins/collapsible-sections/)

```
```js collapse={1-5, 12-14, 21-24}
// 这里的初始化样板代码将被折叠
import { someBoilerplateEngine } from '@example/some-boilerplate'
import { evenMoreBoilerplate } from '@example/even-more-boilerplate'

const engine = someBoilerplateEngine(evenMoreBoilerplate())

// 这部分代码默认可见
engine.doSomething(1, 2, 3, calcFn)

function calcFn() {
  // 您可以设置多个折叠区域
  const a = 1
  const b = 2
  const c = a + b

  // 这一行保持可见
  console.log(`计算结果: ${a} + ${b} = ${c}`)
  return c
}

// 结尾的样板代码也会被再次折叠
engine.closeConnection()
engine.freeMemory()
engine.shutdown({ reason: 'End of example boilerplate code' })```
```


```js collapse={1-5, 12-14, 21-24}
// 这里的初始化样板代码将被折叠
import { someBoilerplateEngine } from '@example/some-boilerplate'
import { evenMoreBoilerplate } from '@example/even-more-boilerplate'

const engine = someBoilerplateEngine(evenMoreBoilerplate())

// 这部分代码默认可见
engine.doSomething(1, 2, 3, calcFn)

function calcFn() {
  // 您可以设置多个折叠区域
  const a = 1
  const b = 2
  const c = a + b

  // 这一行保持可见
  console.log(`计算结果: ${a} + ${b} = ${c}`)
  return c
}

// 结尾的样板代码也会被再次折叠
engine.closeConnection()
engine.freeMemory()
engine.shutdown({ reason: 'End of example boilerplate code' })
```

## 6. 行号 (Line Numbers)

[行号插件](https://expressive-code.com/plugins/line-numbers/)

### 为代码块显示行号

```
```js showLineNumbers
// 这个代码块将显示行号
console.log('来自第 2 行的问候！')
console.log('我在第 3 行')```
```

```js showLineNumbers
// 这个代码块将显示行号
console.log('来自第 2 行的问候！')
console.log('我在第 3 行')
```

---

```
```js showLineNumbers=false
// 这个代码块禁用了行号
console.log('你好？')
console.log('抱歉，你知道我在哪一行吗？')```
```


```js showLineNumbers=false
// 这个代码块禁用了行号
console.log('你好？')
console.log('抱歉，你知道我在哪一行吗？')
```

### 修改起始行号

```
```js showLineNumbers startLineNumber=5
console.log('来自第 5 行的问候！')
console.log('我在第 6 行')```
```

```js showLineNumbers startLineNumber=5
console.log('来自第 5 行的问候！')
console.log('我在第 6 行')
```
