<div align="center">

# 🌸 Fuwari Enhanced

**基于 [saicaca/fuwari](https://github.com/saicaca/fuwari) 深度定制的个人博客系统**

[![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Svelte](https://img.shields.io/badge/Svelte-5.x-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[🖥️ 在线预览](https://www.micostar.cc) · [📦 初始仓库](https://github.com/saicaca/fuwari) · [📖 博客编辑指南](./BLOG_GUIDE.md) · [🛠️ 个性化修改指南](./FUWARI_CUSTOMIZATIONS.md)

以及此版本的上一代来自这个[📦仓库](https://github.com/afoim/fuwari)

</div>

---

## ✨ 魔改特性

在保留原版优雅设计的基础上，本版本新增了以下功能：

### 🖼️ 智能图片系统
- **双CDN图床回退** — 主力图床失效时自动切换至备用图床，保障图片稳定加载
- **Fancybox 图片灯箱** — 点击图片即可放大查看，支持手势缩放和滑动

### 🔒 安全与隐私
- **防盗链保护** — 域名检测与安全警告，防止内容被恶意嵌入
- **隐私友好分析** — Umami 无 Cookie 分析始终运行；Google Analytics & AdSense 仅在用户同意后动态加载
- **Cookie 同意弹窗** — 右下角丝滑弹出，双语（中英）展示，支持"始终记住"选项，隐私页面可随时重置

### 📊 监控与 SEO
- **IndexNow 集成** — 一键推送新内容至搜索引擎，加速收录
- **站点状态监控** — 集成 UptimeRobot，实时监控站点可用性
- **流量监控面板** — EdgeOne 流量分析，掌握访问趋势
- **智能 CDN 识别** — 自动检测并显示当前链路 (Cloudflare/EdgeOne/Vercel)
- **热门排名自动部署** — GitHub Actions 每日检测热门文章 Top 5 排名变化，自动触发重新部署

### 📝 内容增强
- **目录导航 (TOC)** — 长文自动生成右侧目录，快速跳转
- **文章置顶** — 支持 `pinned: true` 将重要文章置顶显示
- **文章排序** — 悬浮按钮支持按发布时间/更新时间/浏览量排序，浏览量排序跳转至 `/hot/` 分页（构建时按 pageviews 降序生成）
- **数学公式** — KaTeX 渲染，完美支持 LaTeX 语法
- **GitHub 风格提示块** — 支持 NOTE / TIP / WARNING 等 Admonitions
- **代码块增强** — 可折叠代码、行号显示、GitHub Dark 主题

### 🎨 视觉体验
- **自定义背景图** — 支持动态随机背景，opacity 可调
- **强制暗黑模式** — 默认深色主题，沉浸式阅读体验
- **平滑页面过渡** — Swup 驱动的丝滑切换动画

### 🧩 应用中心
- **Apps 页面** — 展示个人应用、工具和服务链接

### 🤝 友链自动化
- **PR 自动合并** — 提交友链 JSON 文件后自动校验格式、检测互链并合并
- **互链检测** — 自动抓取对方友链页面，验证是否已添加本站链接
- **排序管理** — `_order.json` 控制展示顺序，新友链自动追加到末尾

---

## 🚀 快速开始

### 环境要求
- **Node.js** 18+
- **pnpm** 9+

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/Besty0728/fuwari.git

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 `http://localhost:4321` 即可预览。

---

## 📂 项目结构

```
src/
├── config.ts          # 🎯 站点配置入口 (必改)
├── content/posts/     # 📝 博客文章 (Markdown)
├── components/        # 🧩 UI 组件
├── layouts/           # 📐 页面布局
├── pages/             # 🔗 路由页面
└── plugins/           # 🔌 Rehype/Remark 插件
scripts/
├── new-post.js        # ✍️ 创建新文章脚本
├── migrate-from-sqlite.mjs  # 📥 SQLite 数据迁移
└── submit-indexnow*.mjs     # 🔍 IndexNow 推送脚本
```

---

## ⚙️ 常用命令

| 命令 | 说明 |
| :--- | :--- |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 预览生产构建 |
| `pnpm new-post "标题"` | 创建新文章 |
| `pnpm build:indexnow` | 构建并推送 IndexNow |
| `pnpm lint` | 代码检查 |
| `pnpm format` | 代码格式化 |

---

## 📝 文章 Frontmatter

```yaml
---
title: '文章标题'
published: 2026-03-30
description: '文章摘要'
image: '封面图链接'  
tags: ['分类1', '分类2', '分类3', '分类4']
category: '文章类别'
ai: 'AI摘要'
draft: false 
lang: 'zh-CN'
order: 1  # 置顶文章，1为指定，-1为置底，0默认
---
```

---

## 🔧 配置说明

主要配置位于 `src/config.ts`：

| 配置项 | 说明 |
| :--- | :--- |
| `siteConfig` | 站点标题、描述、主题色、背景图等 |
| `navBarConfig` | 导航栏链接配置 |
| `profileConfig` | 作者信息与社交链接 |
| `imageFallbackConfig` | 双CDN图床域名配置 |
| `antiLeechConfig` | 防盗链域名白名单 |
| `umamiConfig` | Umami 分析配置 |
| `googleAnalyticsConfig` | GA 分析配置 |

---

## 🌐 部署

本项目支持以下平台一键部署：
- [EdegOne](https://edgeone.ai)(推荐)
- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [Cloudflare Pages](https://pages.cloudflare.com)

部署前请确保已配置 `astro.config.mjs` 中的 `site` 字段。

---

## 📄 许可证

本项目基于 [MIT License](./LICENSE) 开源。

内容遵循 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 协议。

---

