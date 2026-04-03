---
title: 为项目添加一键部署按钮
published: 2026-03-30
description: 本文介绍了如何利用 Markdown 语法在 GitHub 仓库中集成一键部署按钮，重点讲解了 EdgeOne Pages、Vercel 及 Netlify 的配置方法，旨在降低项目使用门槛。
image: 'https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg'
tags: ['GitHub', '自动化部署', 'EdgeOne', 'Vercel']
category: '技术专栏'
ai: '本文通过实例演示了主流云平台一键部署按钮的实现逻辑，涵盖了从基础链接替换到高级构建参数配置的技术细节。'
draft: false 
lang: 'zh-CN'
order: 0
---


你一定在 GitHub 上见过不少项目都带有这样的一键部署按钮： ![vercel](https://vercel.com/button) ![netlify](https://www.netlify.com/img/deploy/button.svg) ![edgeone](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg) ![cloudflare](https://deploy.workers.cloudflare.com/button)

这些按钮不仅视觉炫酷美观，更重要的是——**只需点击一下，就能直接跳转到对应云平台的部署页面**，省去了手动 fork、clone、配置等繁琐步骤，极大降低了项目的使用门槛。

这类功能最常用于静态网站、前端应用类项目，但也不限于此。例如雨云也提供了类似的一键部署按钮![通过雨云一键部署](https://rainyun-apps.cn-nb1.rains3.com/materials/deploy-on-rainyun-cn.svg)不过需要先上架至其应用商店。相比之下，Vercel、Netlify、EdgeOne Pages这几大平台则更加开放：**你只需将部署链接中的仓库参数替换为自己的 GitHub 地址，即可立即启用一键部署能力**，让你的项目在几分钟内部署到云端。

## 原理[#](https://blog.tianhw.top/posts/one-click-deploy-button/#%E5%8E%9F%E7%90%86)

这些一键部署按钮本质上是一种通过Markdown语法实现的链接，当用户点击该按钮时，会跳转到目标云服务提供商的部署界面。 这种按钮的通用语法格式为：

```css
[![ Deploy Button Text ](SVG Image URL)](Deployment URL)
```

**其中，SVG图片由云服务提供商提供，就是我们外观上看到的按钮样式**。 部署链接则指向云服务提供商的部署页面，并可能包含一些查询参数，用于指定要部署的GitHub仓库地址，甚至还能包含构建命令、输出目录等信息。

## 添加[#](https://blog.tianhw.top/posts/one-click-deploy-button/#%E6%B7%BB%E5%8A%A0)

### EdgeOne Pages[#](https://blog.tianhw.top/posts/one-click-deploy-button/#edgeone-pages)

#### 基础用法[#](https://blog.tianhw.top/posts/one-click-deploy-button/#%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95)

只需将以下 Markdown 代码添加到你 GitHub 仓库的 `README.md` 文件中，把`YOUR_REPO_URL`替换为你的项目地址即可为项目启用 **EdgeOne Pages 一键部署** 功能：

```less
[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?repository-url=YOUR_REPO_URL)
```

以 [EdgeOne-Random-Picture](https://github.com/H2O-ME/EdgeOne-Random-Picture) 项目为例：

```ruby
[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?repository-url=https://github.com/H2O-ME/EdgeOne-Random-Picture)
```

#### 高级用法：带构建参数[#](https://blog.tianhw.top/posts/one-click-deploy-button/#%E9%AB%98%E7%BA%A7%E7%94%A8%E6%B3%95%E5%B8%A6%E6%9E%84%E5%BB%BA%E5%8F%82%E6%95%B0)

EdgeOne Pages 支持通过 URL 参数精细控制部署行为：

|   Search 参数名称    |                   描述                    |
|------------------|-----------------------------------------|
|     `template`     |          通过 Pages 官方模板来部署的模板名称          |
| `repository-name`  |               Github 仓库名称               |
|  `repository-url`  |         通过其他 GitHub 仓库来部署的仓库地址          |
|   `project-name`   |                  项目名称                   |
|  `build-command`   |                  构建命令                   |
| `install-command`  |                  安装命令                   |
| `output-directory` |               构建后产物的输出目录                |
|  `root-directory`  |                  构建根目录                  |
|       `env`        | 仓库必要的环境变量，如需多个可用英文逗号连接，如：KEY1,KEY2,KEY3 |
| `env-description`  |               跟环境变量相关的描述                |
|     `env-link`     |               跟环境变量相关的链接                |

以 [saicaca/fuwari](https://github.com/saicaca/fuwari)（基于 Astro 的静态博客模板）为例：

我在该链接指定了以下参数：

-   安装命令：`pnpm install`
-   构建命令：`pnpm run build`
-   输出目录：`dist`

```perl
[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?repository-url=https%3A%2F%2Fgithub.com%2Fsaicaca%2Ffuwari&install-command=pnpm%20install&build-command=pnpm%20run%20build&output-directory=dist)
```

注意：URL 中的特殊字符（如 `/`、空格）需进行 **URL 编码**（例如 `%2F` 代表 `/`）

### Vercel[#](https://blog.tianhw.top/posts/one-click-deploy-button/#vercel)

#### 基础用法[#](https://blog.tianhw.top/posts/one-click-deploy-button/#%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95-1)

```ruby
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/username/repository)
```

**Vercel 的一键部署按钮也可以直接通过其官方部署链接生成器生成**，因此如果你需要添加更多的部署参数可以前往[使用部署按钮](https://vercel.com/docs/deploy-button)自行生成，无需考虑markdown语法等问题，这里不重新造轮子了。

### Netlify[#](https://blog.tianhw.top/posts/one-click-deploy-button/#netlify)

Netlify 的部署按钮不支持提供 URL 参数控制构建参数，需通过项目的 `netlify.toml` 文件配置构建行为。 **Netlify的一键部署按钮链接格式为**：

```ruby
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/your-repo)
```

具体示例：

```ruby
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/H2O-ME/IPFS-img-host)
```

## 转载说明
- [为项目添加一键部署按钮 - THW's Blog](https://blog.tianhw.top/posts/one-click-deploy-button/)