---
title: 如何在 Fuwari 博客页脚添加 ICP 备案及运行时间
published: 2026-03-30
description: '本教程详细介绍了如何通过修改 src/components/Footer.astro 文件，为 Fuwari 主题添加自定义页脚信息，包括网站运行时间 JS 脚本、ICP 备案链接以及又拍云等赞助标识。'
image: '' 
tags: ['Fuwari', 'Astro', '前端开发', '博客改造']
category: '博客改造'
ai: '本文提供了在 Astro 框架下 Fuwari 主题修改页脚布局的具体代码实现，包含运行时间统计脚本。'
draft: false 
lang: 'zh-CN'
order: 0
---
## 架构

其核心逻辑是：**在页脚组件中通过 HTML 结构承载内容，利用 CSS 进行样式美化，并配合 JavaScript 实现动态的时间计算。**

### 1. 结构层 (HTML/Astro Component)
Fuwari 是基于 Astro 框架构建的，页脚逻辑位于 `src/components/Footer.astro`。

* **ICP 备案：** 通常在页脚的 `div` 容器内添加一个新的 `<span>` 或 `<a>` 标签。
    * **架构要点：** 必须包含指向工信部官网的超链接（`href="https://beian.miit.gov.cn/"`），这是合规性的基本要求。
* **运行时间：** 添加一个带有特定 `id`（如 `runtime_span`）的占位容器，用于后续脚本动态填充内容。

### 2. 逻辑层 (JavaScript)
由于“运行时间”需要实时更新（或在页面加载时计算），需要在 `.astro` 文件的 `<script>` 标签内编写逻辑：

* **起始时间设定：** 定义一个初始化的 `Date` 对象作为建站日期。
* **计算函数：**
    * 获取当前时间：`new Date()`。
    * 计算差值：$t2 - t1$。
    * 单位转换：通过数学运算将毫秒差值转换为 **天、时、分、秒**。
* **定时更新：** 使用 `setInterval(update_function, 1000)` 每秒刷新一次 DOM 内容，确保时间是“跳动”的。

### 3. 表现层 (CSS/Tailwind)
Fuwari 默认使用 Tailwind CSS。

* **布局控制：** 备案号与运行时间通常使用 `flex` 布局或简单的换行符进行排列，以确保在移动端和桌面端都能居中对齐。
* **样式细节：** 通过类名（如 `text-sm`, `opacity-70`）调整字体大小和透明度，使其与原主题的极简风格保持一致。

---

### 总结架构流程图

| 步骤 | 涉及文件 | 核心动作 |
| :--- | :--- | :--- |
| **定位** | `Footer.astro` | 找到页脚的 HTML 渲染区域 |
| **注入** | `HTML 标签` | 写入备案号文本和运行时间占位符 |
| **计算** | `<script>` | 编写 JS 逻辑处理时间戳差值 |
| **渲染** | `DOM 操作` | `innerText` 将结果填充进占位符 |
| **优化** | `Tailwind` | 调整边距、颜色和响应式显示 |


## 实操

 找到 `src/components/Footer.astro` 这个文件  
 你会发现页脚的rss以及sitemap都在这里  
 直接复制rss的模板，填写好你想要添加的信息后复制在后面  
 当然，不需要rss/sitemap，以及powered by的也可以直接在此删除


:::note
注意在添加跳转链接时  
记得把href={`url(`’xxxx’`)`}  
的url等删除，否则跳转链接前会自带你设置的站点网址  
当然删除与否根据你的需求来判断
:::


```astro ins={19,22-31}
---
import { profileConfig } from '../config'
import { url } from '../utils/url-utils'
---

<div class="card-base max-w-[var(--page-width)] min-h-[4.5rem] rounded-b-none mx-auto flex items-center px-6 justify-between">

<!--左侧信息 -->
    <div class="transition text-50 text-sm max-md:text-left mt-2">
        © 2024 {profileConfig.name}. All Rights Reserved. /
        <a class="link text-[var(--primary)] font-medium" target="_blank" href={url('rss.xml')}>RSS</a>
    <!--
        <a class="link text-[var(--primary)] font-medium" target="_blank" href={url('sitemap-index.xml')}>Sitemap</a>
    -->
        <br>
        Powered by
        <a class="link text-[var(--primary)] font-medium" target="_blank" href="https://astro.build">Astro</a> &
        <a class="link text-[var(--primary)] font-medium" target="_blank" href="https://github.com/saicaca/fuwari">Fuwari</a> &
        <a class="link text-[var(--primary)] font-medium" target="_blank" href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral">又拍云CDN</a>
    </div>

<!--运行时间 -->
    <script type="text/javascript">function runtime(){const t=new Date("09/01/2024 08:00:00"),n=new Date,s=n-t,e=Math.floor(s/1e3),o=Math.floor(e/86400),i=Math.floor(e%86400/3600),a=Math.floor(e%3600/60),r=e%60;document.getElementById("runningtime").innerHTML=`⭐本站已运行: ${o}天${i}小时${a}分${r}秒 ☁️`}setInterval(runtime,1e3)</script>
    <div class="transition text-50 text-sm text-center hidden md:block"><p id="runningtime"> </p></div>

<!--右侧备案等信息 -->
    <div class="transition text-50 text-sm max-md:text-right mt-2">
        <a class="link text-[var(--primary)] font-medium" target="_blank" href={'https://beian.miit.gov.cn'}>xICP备xxxxxxxxxx号</a>
        <br>
        <a class="link text-[var(--primary)] font-medium" target="_blank" href={'https://icp.gov.moe/?keyword=20245060'}>萌ICP备20245060号</a>
    </div>
</div>
```


## ⚠️ 常见问题：构建失败 (expand-animation)

如果在部署到 Cloudflare Pages 或进行 Vite 构建时遇到类似以下的错误：
`[postcss] /src/styles/markdown.css:23:9: The expand-animation class does not exist.`

### 错误原因
这是因为 Fuwari 主题在 `markdown.css` 中使用了 Tailwind 的 `@apply` 指令来引用 `expand-animation` 类，但该类定义在 `main.css` 中。在某些构建环境下，PostCSS 无法跨文件识别非原生的 Tailwind 类。

### 解决方案
在 `src/styles/markdown.css` 文件的顶部（不要放在任何大括号内），手动添加该类的定义：

```css
.expand-animation {
    @apply relative before:ease-out before:transition active:bg-none hover:before:bg-[var(--btn-plain-bg-hover)] active:before:bg-[var(--btn-plain-bg-active)] z-0
    before:absolute before:rounded-[inherit] before:inset-0 before:scale-[0.85] hover:before:scale-100 before:-z-10;
}
```

注意：不要在外面包裹 `@layer components`，除非你在该文件顶部也引入了 `@tailwind components`。

### 💡 转载说明
> **本文转载自：** [AULyPc 的博客](https://aulypc1.github.io/)  
> **原文作者：** [AULyPc](https://aulypc1.github.io/about/)  
> **原文标题：** 《如何在Fuwari页脚添加ICP、运行时间等信息》  
> **原文链接：** [https://aulypc1.github.io/posts/website/add_icpruntime_in_fuwari-footer/](https://aulypc1.github.io/posts/website/add_icpruntime_in_fuwari-footer/)  
> **许可协议：** 本文采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans) 许可协议，转载请注明出处。