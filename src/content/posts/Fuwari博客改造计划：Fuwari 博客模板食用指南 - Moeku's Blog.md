---
title: Fuwari 博客模板综合食用指南
published: 2026-03-30
description: '一份关于如何使用 Fuwari 博客模板的简略指南，涵盖文章元数据、Markdown 语法扩展、代码高亮及视频嵌入等功能。'
image: ''
tags: ['Fuwari', 'Astro', 'Markdown', '教程']
category: '技术专栏'
ai: '本文详细介绍了基于 Astro 构建的 Fuwari 模板的使用方法，重点讲解了 Front-matter 配置、GitHub 仓库卡片、提示框组件以及 Expressive Code 代码块的高级用法。'
draft: false 
lang: 'zh-CN'
order: 0
---

## 文章元数据 (Front-matter)[#](https://blog.moeku.org/posts/guide/#%E6%96%87%E7%AB%A0%E5%85%83%E6%95%B0%E6%8D%AE-front-matter)

每篇文章顶部的 YAML 代码块用于定义文章的元数据。

```yaml
---
title: 我的第一篇博客文章
published: 2023-09-09
description: 这是我 Astro 新博客的第一篇文章。
image: ./cover.jpg
tags: [Foo, Bar]
category: 前端
draft: false
---
```

| 属性 (Attribute) | 描述 (Description) |
| :--- | :--- |
| title | 文章的标题。 |
| published | 文章的发布日期。 |
| updated | (可选) 文章的更新日期。 |
| description | 文章的简短描述，会显示在首页。 |
| image | 文章的封面图片路径。<br>1. 以 `http://` 或 `https://` 开头：使用网络图片<br>2. 以 `/` 开头：使用 `public` 目录下的图片<br>3. 无上述前缀：相对于当前 Markdown 文件的路径 |
| tags | 文章的标签。 |
| category | 文章的分类。 |
| draft | 文章是否为草稿。若为 `true`，则文章不会被公开发布和展示。 |                                  |

### 草稿示例[#](https://blog.moeku.org/posts/guide/#%E8%8D%89%E7%A8%BF%E7%A4%BA%E4%BE%8B)

如果一篇文章仍在撰写中，不希望被公开发布，可以将其 `draft` 字段设置为 `true`。

```yaml
---
title: 草稿示例
published: 2022-07-01
tags: [Markdown, Blogging, Demo]
category: Examples
draft: true
---

# 这篇文章是一篇草稿

这篇文章目前处于草稿状态，不会被发布。
```

## 文章存放位置[#](https://blog.moeku.org/posts/guide/#%E6%96%87%E7%AB%A0%E5%AD%98%E6%94%BE%E4%BD%8D%E7%BD%AE)

您的文章文件应放置在 `src/content/posts/` 目录下。您也可以创建子目录来更好地组织您的文章和相关资源。

```swift
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```

## 基础 Markdown 语法[#](https://blog.moeku.org/posts/guide/#%E5%9F%BA%E7%A1%80-markdown-%E8%AF%AD%E6%B3%95)

### 标题[#](https://blog.moeku.org/posts/guide/#%E6%A0%87%E9%A2%98)

```css
# H1 标题
## H2 标题
### H3 标题
```

### 文本格式[#](https://blog.moeku.org/posts/guide/#%E6%96%87%E6%9C%AC%E6%A0%BC%E5%BC%8F)

段落之间通过一个空行分隔。

这是第二段。_斜体_, **粗体**, 和 `等宽字体`。

### 列表[#](https://blog.moeku.org/posts/guide/#%E5%88%97%E8%A1%A8)

**无序列表**

```
- 列表项一
- 列表项二
- 列表项三
```

**有序列表**

```markdown
1. 第一项
2. 第二项
3. 第三项
```

**嵌套列表**

```markdown
1. 首先，准备这些食材：
    - 胡萝卜
    - 芹菜
    - 扁豆
2. 烧开一些水。
3. 把所有东西倒进锅里，然后遵循
    这个算法：

        找到木勺
        揭开锅盖
        搅拌
        盖上锅盖
        小心地把木勺平衡在锅柄上
        等待10分钟
        返回第一步（或者完成后关火）
```

**定义列表**

```makefile
苹果
: 做苹果酱的好材料。

橘子
: 柑橘类水果！

西红柿
: Tomatoe 这个词里没有 "e"。```

### 引用块

> 引用块是
> 这么写的。
>
> 如果需要，它们可以
> 跨越多个段落。

### 代码块

使用4个空格缩进或使用三个反引号 ``` 来创建代码块。
```

```less
import time
# 快，数到十！
for i in range(10):
    # (但不要 *太* 快)
    time.sleep(0.5)
    print i
```

### 其他[#](https://blog.moeku.org/posts/guide/#%E5%85%B6%E4%BB%96)

**链接**

这是一个指向 [某个网站](http://foo.bar/) 的链接。

```less
这是一个指向 [某个网站](http://foo.bar) 的链接。
```

**脚注**

这是一个脚注 [^1]。

[^1]: 脚注文本放在这里。

```css
这是一个脚注 [^1]。

[^1]: 脚注文本放在这里。
```

**水平分割线**

```lua
---
```

**表格**

```sql
尺寸   材质      颜色
---    ---       ---
9      皮革      棕色
10     麻帆布    自然色
11     玻璃      透明

Table: 鞋子、尺码及其材质
```

**数学公式**

行内公式：$\omega = d\phi / dt$

块级公式： $I = \int \rho R^{2} dV$

### 嵌入视频[#](https://blog.moeku.org/posts/guide/#%E5%B5%8C%E5%85%A5%E8%A7%86%E9%A2%91)

只需从 YouTube 或其他平台复制嵌入代码（embed code），然后将其粘贴到 Markdown 文件中即可。
```yaml
---
title: Include Video in the Post
published: 2023-10-19
// ...
---

<iframe width="100%" height="468" src="https://www.youtube.com/embed/5gIf0_xpFPI?si=N1WTorLKL0uwLsU_" title="YouTube video player" frameborder="0" allowfullscreen></iframe>
```

#### YouTube

<iframe width="100%" height="468" src="https://www.youtube.com/embed/5gIf0_xpFPI?si=N1WTorLKL0uwLsU_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

#### Bilibili

<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=BV1fK4y1s7Qf&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### 扩展功能[#](https://blog.moeku.org/posts/guide/#%E6%89%A9%E5%B1%95%E5%8A%9F%E8%83%BD)

#### GitHub 存储库卡片[#](https://zrnq.cn/posts/markdown-extended/#github-%E5%AD%98%E5%82%A8%E5%BA%93%E5%8D%A1%E7%89%87)

::github{repo="worhllo2/Blog-fuwari"}

使用代码创建 GitHub 存储库卡片。 `::github{repo="<owner>/<repo>"}`.

```
::github{repo="saicaca/fuwari"}
```

#### 警告[#](https://zrnq.cn/posts/markdown-extended/#%E8%AD%A6%E5%91%8A)

支持以下类型的警告: `note` `tip` `important` `warning` `caution`

:::note
突出显示用户应该考虑的信息，即使在浏览时也是如此。
:::

:::tip
帮助用户取得更大成功的可选信息。
:::

:::important
用户成功所需的关键信息。
:::

:::warning
由于潜在风险，需要立即用户关注的关键内容。
:::

:::caution
行动的负面潜在后果。
:::


#### Basic Syntax[#](https://zrnq.cn/posts/markdown-extended/#basic-syntax)

```makefile
:::note
突出显示用户应该考虑的信息，即使在浏览时也是如此。
:::

:::tip
帮助用户取得更大成功的可选信息。
:::
```

### 自定义标题[#](https://zrnq.cn/posts/markdown-extended/#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%87%E9%A2%98)

警告的标题可以自定义。

:::note[我的自定义标题]
这是带有自定义标题的注释。
:::

```
:::note[我的自定义标题]
这是带有自定义标题的注释。
:::
```

### GitHub 语法[#](https://zrnq.cn/posts/markdown-extended/#github-%E8%AF%AD%E6%B3%95)

> [!NOTE]
> GitHub语法也受支持。

```
> [!NOTE]
> GitHub语法也受支持。

> [!TIP]
> GitHub语法也受支持。
```

### 隐藏内容 (Spoiler)[#](https://blog.moeku.org/posts/guide/#%E9%9A%90%E8%97%8F%E5%86%85%E5%AE%B9-spoiler)

您可以在文本中添加隐藏内容，点击后才会显示。内容区域也支持 **Markdown** 语法。

这部分内容 :spoiler[是隐藏的 **嘿嘿**]!

```less
这部分内容 :spoiler[是隐藏的 **嘿嘿**]!
```

## 代码块高级功能 (Expressive Code)[#](https://blog.moeku.org/posts/guide/#%E4%BB%A3%E7%A0%81%E5%9D%97%E9%AB%98%E7%BA%A7%E5%8A%9F%E8%83%BD-expressive-code)

本模板使用 [Expressive Code](https://expressive-code.com/) 来增强代码块的显示效果。

### 语法高亮[#](https://blog.moeku.org/posts/guide/#%E8%AF%AD%E6%B3%95%E9%AB%98%E4%BA%AE)

**常规语法高亮**

```bash
1console.log('这段代码被语法高亮了！')
```

**渲染 ANSI 转义序列**

```yaml
ANSI colors:
- Regular: Red Green Yellow Blue Magenta Cyan
- Bold:    Red Green Yellow Blue Magenta Cyan
- Dimmed:  Red Green Yellow Blue Magenta Cyan

256 colors (showing colors 160-177):
160 161 162 163 164 165
166 167 168 169 170 171
172 173 174 175 176 177

Full RGB colors:
ForestGreen - RGB(34, 139, 34)

Text formatting: Bold Dimmed Italic Underline
```

### 编辑器与终端窗口边框[#](https://blog.moeku.org/posts/guide/#%E7%BC%96%E8%BE%91%E5%99%A8%E4%B8%8E%E7%BB%88%E7%AB%AF%E7%AA%97%E5%8F%A3%E8%BE%B9%E6%A1%86)

**代码编辑器边框**

```bash
console.log('使用 title 属性的例子')
```

**终端窗口边框**

```php
echo "这个终端窗口没有标题"
```

### 文本与行标记[#](https://blog.moeku.org/posts/guide/#%E6%96%87%E6%9C%AC%E4%B8%8E%E8%A1%8C%E6%A0%87%E8%AE%B0)

**标记整行与行范围**

```ruby
// 第 1 行 - 通过行号标记
// 第 2 行
// 第 3 行
// 第 4 行 - 通过行号标记
// 第 5 行
// 第 6 行
// 第 7 行 - 通过范围 "7-8" 标记
// 第 8 行 - 通过范围 "7-8" 标记
```

**选择标记类型 (mark, ins, del)**

```javascript
function demo() {
  console.log('这行被标记为删除')
  // 这行和下一行被标记为插入
  console.log('这是第二行插入的内容')

  return '这行使用默认的中性标记类型'
}
```

**使用类似 diff 的语法**

```
这行将被标记为插入
这行将被标记为删除
这是一行常规文本
```

**标记行内指定文本**

```csharp
function demo() {
  // 标记行内的任何指定文本
  return '支持对指定文本的多个匹配项进行标记';
}
```

**使用正则表达式**

```bash
console.log('单词 yes 和 yep 会被标记。')
```

### 自动换行[#](https://blog.moeku.org/posts/guide/#%E8%87%AA%E5%8A%A8%E6%8D%A2%E8%A1%8C)

**为代码块配置自动换行**

```bash
// 自动换行的例子
function getLongString() {
  return '这是一个非常非常长的字符串，除非容器特别宽，否则很可能无法在可用空间内完全显示'
}
```

### 可折叠区域[#](https://blog.moeku.org/posts/guide/#%E5%8F%AF%E6%8A%98%E5%8F%A0%E5%8C%BA%E5%9F%9F)

通过 `collapse` 属性可以折叠指定的代码行。

```
// 这部分样板代码将被折叠
import { someBoilerplateEngine } from '@example/some-boilerplate'
import { evenMoreBoilerplate } from '@example/even-more-boilerplate'

const engine = someBoilerplateEngine(evenMoreBoilerplate())

// 这部分代码默认可见
engine.doSomething(1, 2, 3)
```

### 行号[#](https://blog.moeku.org/posts/guide/#%E8%A1%8C%E5%8F%B7)

**显示行号**

```bash
// 这个代码块会显示行号
console.log('来自第 2 行的问候！')
console.log('我在第 3 行')
```

**更改起始行号**

```bash
console.log('来自第 5 行的问候！')
console.log('我在第 6 行')
```

