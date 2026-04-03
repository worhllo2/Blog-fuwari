---
title: 为 Astro 加上在新标签页打开链接的功能
published: 2026-03-31
description: '原版 Astro（包括 Fuwari）中，打开外部链接默认在当前页面。本文教你如何配置 rehype-external-links 插件，让链接自动在新标签页打开。'
image: 'https://imgbed.142588.xyz/file/1775016215240_cover_164185.png'
tags: ['Astro', 'Fuwari', '插件', '教程']
category: '技术专栏'
ai: '本文针对 Astro 框架（以 Fuwari 主题为例）默认不支持新标签页打开外部链接的问题，提供了详细的解决方案。通过安装并配置 rehype-external-links 插件，开发者可以自动为所有外部链接添加 target="_blank" 属性，从而提升用户阅读体验，避免页面跳转导致的内容丢失。'
draft: false 
lang: 'zh-CN'
order: 0
---

## 前言

在原生的 [Astro](https://astro.build/) 或 [Fuwari](https://github.com/saicaca/fuwari) 主题中，点击外部链接通常会在当前页面直接打开。这对于需要频繁参考外部文档的教程类文章来说体验并不友好。虽然也能鼠标中键在新标签页打开链接，不过还是挺麻烦的。

何谓点击连接在新标签页打开，最简单的例子：[打开必应](https://www.bing.com/)   |   [在新标签页打开必应](https://www.bing.com/)

两者的区别：
```
1<a href="https://www.bing.com">打开必应</a>
```

```
1<a href="https://www.bing.com" target="_blank">在新标签页打开必应</a>
```
因此，本文将介绍如何使用 [rehype-external-links](https://www.npmjs.com/package/rehype-external-links) 插件来完美解决这个问题。

---


## 安装插件[#](https://blog.adclosenn.top/posts/newtab_link/#%E5%AE%89%E8%A3%85%E6%8F%92%E4%BB%B6)

假如你的项目使用的包管理器是 pnpm，那就用 pnpm 的命令安装。npm 同理。

```
1pnpm i rehype-external-links
```

```
1npm i rehype-external-links
```

安装成功后你的 `package.json` 中会新增一个类似于 `"rehype-external-links": "^3.0.0",` 的行：

```
    "rehype-components": "^0.3.0",
    "rehype-external-links": "^3.0.0",
    "rehype-katex": "^7.0.1",
```

## 配置插件[#](https://blog.adclosenn.top/posts/newtab_link/#%E9%85%8D%E7%BD%AE%E6%8F%92%E4%BB%B6)

在根目录的 `astro.config.mjs` 文件内加入以下**5行**代码：

```
新增的代码在132至137行
```

```
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import swup from "@swup/astro";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components"; /* Render the custom directive content */
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive"; /* Handle directives */
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import { expressiveCodeConfig } from "./src/config.ts";
import { pluginLanguageBadge } from "./src/plugins/expressive-code/language-badge.ts";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
import { pluginCustomCopyButton } from "./src/plugins/expressive-code/custom-copy-button.js";
import rehypeExternalLinks from 'rehype-external-links';

// https://astro.build/config
export default defineConfig({
  site: "https://adclosenn.top",
  base: "/",
  trailingSlash: "always",
  integrations: [
    tailwind({
      nesting: true,
    }),
    swup({
      theme: false,
      animationClass: "transition-swup-", // see https://swup.js.org/options/#animationselector
      // the default value `transition-` cause transition delay
      // when the Tailwind class `transition-all` is used
      containers: ["main", "#toc"],
      smoothScrolling: true,
      cache: true,
      preload: true,
      accessibility: true,
      updateHead: true,
      updateBodyClass: false,
      globalInstance: true,
    }),
    icon({
      include: {
        "preprocess: vitePreprocess(),": ["*"],
        "fa6-brands": ["*"],
        "fa6-regular": ["*"],
        "fa6-solid": ["*"],
      },
    }),
    expressiveCode({
      themes: [expressiveCodeConfig.theme, expressiveCodeConfig.theme],
      plugins: [
        pluginCollapsibleSections(),
        pluginLineNumbers(),
        pluginLanguageBadge(),
        pluginCustomCopyButton()
      ],
      defaultProps: {
        wrap: true,
        overridesByLang: {
          'shellsession': {
            showLineNumbers: false,
          },
        },
      },
      styleOverrides: {
        codeBackground: "var(--codeblock-bg)",
        borderRadius: "0.75rem",
        borderColor: "none",
        codeFontSize: "0.875rem",
        codeFontFamily: "'Cascadia Mono', 'JetBrains Mono'",
        codeLineHeight: "1.5rem",
        frames: {
          editorBackground: "var(--codeblock-bg)",
          terminalBackground: "var(--codeblock-bg)",
          terminalTitlebarBackground: "var(--codeblock-topbar-bg)",
          editorTabBarBackground: "var(--codeblock-topbar-bg)",
          editorActiveTabBackground: "none",
          editorActiveTabIndicatorBottomColor: "var(--primary)",
          editorActiveTabIndicatorTopColor: "none",
          editorTabBarBorderBottomColor: "var(--codeblock-topbar-bg)",
          terminalTitlebarBorderBottomColor: "none"
        },
        textMarkers: {
          delHue: 0,
          insHue: 180,
          markHue: 250
        }
      },
      frames: {
        showCopyToClipboardButton: false,
      }
    }),
        svelte(),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [
      remarkMath,
      remarkReadingTime,
      remarkExcerpt,
      remarkGithubAdmonitionsToDirectives,
      remarkDirective,
      remarkSectionize,
      parseDirectiveNode,
    ],
    rehypePlugins: [
      rehypeKatex,
      rehypeSlug,
      [
        rehypeComponents,
        {
          components: {
            github: GithubCardComponent,
            note: (x, y) => AdmonitionComponent(x, y, "note"),
            tip: (x, y) => AdmonitionComponent(x, y, "tip"),
            important: (x, y) => AdmonitionComponent(x, y, "important"),
            caution: (x, y) => AdmonitionComponent(x, y, "caution"),
            warning: (x, y) => AdmonitionComponent(x, y, "warning"),
          },
        },
      ],
      [
        rehypeExternalLinks,
        {
        target: '_blank',
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["anchor"],
          },
          content: {
            type: "element",
            tagName: "span",
            properties: {
              className: ["anchor-icon"],
              "data-pagefind-ignore": true,
            },
            children: [
              {
                type: "text",
                value: "#",
              },
            ],
          },
        },
      ],
    ],
  },
  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // temporarily suppress this warning
          if (
            warning.message.includes("is dynamically imported by") &&
            warning.message.includes("but also statically imported by")
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
  },
});
```

至此，插件的配置就完成了。随便找个**文章内链接**点击，应该会在**新标签页**打开，而非原来的在当页打开。