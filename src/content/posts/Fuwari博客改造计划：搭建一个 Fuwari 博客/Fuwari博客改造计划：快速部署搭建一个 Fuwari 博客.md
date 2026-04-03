---
title: '快速部署指南：搭建一个 Fuwari 博客'
published: 2026-03-30
description: '手把手教你如何使用 Astro 与 Fuwari 模板快速构建一个极简且优雅的静态博客，并实现 Netlify 一键部署。'
image: './cover.jpeg'
tags: ['Fuwari', 'Netlify', 'Astro', '教程']
category: '技术专栏'
ai: '本文提供了基于 Fuwari 主题搭建个人博客的完整工作流。内容涵盖 Node.js 环境准备、使用 pnpm 初始化项目、修改 src/config.ts 进行个性化配置，以及通过 Netlify CLI 实现自动化部署。旨在帮助开发者以最低成本拥有一个高性能的静态站点。'
draft: false 
lang: 'zh-CN'
order: 0
---

## 一、准备工作

在开始之前，请确保你的开发环境已安装以下工具：

- **Node.js**（建议使用最新 LTS 版本，如 v18 或 v20）
- **包管理工具**（推荐使用 `pnpm`，本文将基于它进行操作）
- **代码编辑器**（推荐使用 [VS Code](https://code.visualstudio.com/)）
- **Git**（可选）

你可以通过以下命令检查是否已安装 Node.js 和 npm：

```bash
node -v
npm -v
```

如果尚未安装，请前往 [Node.js 官网](https://nodejs.org) 下载并安装。

---

## 二、创建你的 Fuwari 博客

打开终端（命令行工具），选择一个工作目录，执行以下命令来全局安装 `pnpm` 和 `Netlify CLI`：

```bash
npm install -g pnpm
npm install -g netlify-cli
```

> 💡 提示：`-g` 表示全局安装，确保命令可在任意目录下使用。

接下来，使用 Astro 的官方创建工具初始化一个 Fuwari 博客项目：

```bash
pnpm create fuwari@latest
```

系统会提示你输入项目名称，然后自动拉取模板并安装依赖。

进入项目目录：

```bash
cd my-fuwari-blog
```

启动本地开发服务器：

```bash
pnpm dev
```

浏览器会自动打开 `http://localhost:4321`，你将看到一个简洁优雅的博客首页，说明项目已成功运行。

---

## 三、自定义你的博客

Fuwari 的配置文件位于根目录下的 `src/config.ts`，你可以在这里修改：

- 博客标题（title）
- 博客副标题（subtitle）
- 语言(lang)
- 博客横幅（banner）
- 站点 URL 等

例如：

```ts title="src/config.ts"
export const siteConfig: SiteConfig = {
	title: "晓正杨博客",
	subtitle: "",
	lang: "zh_CN", // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th'
	themeColor: {
		hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: false,
		src: "https://cn.cravatar.com/avatar/422d385af346ddd0b23f81d704ecf1c6", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		// {
		//   src: '/favicon/icon.png',    // Path of the favicon, relative to the /public directory
		//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		// }
	],
};
```

文章内容位于 `src/content/posts/` 目录中，使用 Markdown 编写。你可以复制示例文章并新建自己的 `.md` 文件。

> ✅ 命名规范：建议使用小写字母、连字符命名，如 `how-to-build-a-blog.md`。

---

## 四、构建静态文件

当你完成内容编辑后，使用以下命令生成静态页面：

```bash
pnpm build
```

构建完成后，会在项目根目录生成 `dist/` 文件夹，其中包含所有可供部署的 HTML、CSS 和 JavaScript 文件。

---

## 五、将本地项目上传至Github

如果你是通过 HTTPS 克隆的可以通过 `git set-url origin git@github.com:[你的仓库名称]` 改成 SSH

然后，正常的提交推送就好啦~（依次运行下面的代码）


```sql
git add .
git commit -m "[对提交的描述]"
git push
```

这样你的文章就推送到远程仓库啦~

---

## 六、部署到CloudFlare
- 在 Cloudflare - Workers - Workers 和 Pages - 创建，创建一个 Page
- 关联你之前 Fork 来的 Github 仓库。
- 设置 **构建指令** 为 `pnpm build`，**构建输出目录** 为 `dist
- 绑定自定义域名(可选)，这样访问你绑定的域名就可以访问你的博客啦！

你只需要重复之前的写文章和提交操作，你的文章就会被自动部署到 Cloudflare！


---

## 七、后续文章撰写与维护



如果嫌麻烦的话还可以试试我写的一个简单的脚本，只要在根目录创建一个 `bat` 后缀的文件写入以下内容，以后每次要写文章只需要运行此脚本跟着提示做就可以实现半自动创建文章并提交(～￣▽￣)～（仅Windows）

```sql
@echo off
git pull

:: Create
set /p mark="Press article keywords("-^" to link): "
echo Run it by yourself: pnpm new-post %mark%
echo Then press enter to open the blog with default method.

pause > nul

explorer ".\src\content\posts\%mark%.md"

echo Press enter to submit the blog.
pause > nul

:: Commit
git add .
git commit -m "Update %mark%"
git push

echo Press enter to end.
pause > nul
```


## 八、文章的 Front-matter（前置参数）

```yaml
---
title: 我的第一篇博客文章
published: 2023-09-09
description: 这是我的新 Astro 博客的第一篇文章。
image: ./cover.jpg
tags: [ Foo, Bar ]
category: 前端
draft: false
---
```

| 属性 | 描述 |
| :--- | :--- |
| **title** | 文章的标题。 |
| **published** | 文章的发布日期。 |
| **description** | 文章的简短描述，显示在首页。 |
| **image** | 文章封面图路径。<br>1. 以 `http://` 或 `https://` 开头：使用网络图片。<br>2. 以 `/` 开头：使用 `public` 目录下的图片。<br>3. 无前缀：相对于 Markdown 文件的相对路径。 |
| **tags** | 文章的标签。 |
| **category** | 文章的分类。 |
| **draft** | 如果设为 `true`，则该文章为草稿，不会被显示。 |

-----

## 九、文章文件存放位置

您的文章文件应放置在 `src/content/posts/` 目录下。您还可以创建子目录来更好地组织文章和资源文件。

```plaintext
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```

---

## 十、结语

通过本文，你已经成功搭建并部署了一个基于 **Fuwari + Astro** 的极简静态博客。整个过程无需服务器、不涉及后端，安全、快速、免费。

Fuwari 的设计理念是“少即是多”，让写作者专注于内容本身。现在，是时候开始写下你的第一篇文章了！
