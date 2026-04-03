---
title: 为Fuwari博客添加文章置顶与置底功能
published: 2026-03-30
description: '本文将逐步说明如何通过修改 src/content/config.ts 和 src/utils/content-utils.ts 实现 Fuwari 博客的文章置顶（Top）与置底（Bottom）功能。'
image: ''
tags: ['Fuwari', '功能增强', 'Astro', '博客维护']
category: '技术专栏'
ai: '本文介绍了通过扩展 Astro 内容配置字段并调整排序逻辑，为 Fuwari 博客增加 order 属性以实现文章手动置顶或置底的方法。'
draft: false 
lang: 'zh-CN'
order: 0
---
## 前言
在内容密集的博客中，某些文章可能需要更高的曝光度（如公告、指南）或更低的优先级（如归档、旧闻）。为此，我们为 **Fuwari 博客** 新增了 **文章置顶（Top）与置底（Bottom）** 功能。本文将逐步说明如何通过修改主题配置实现这一能力。

___

## 架构
基于你正在浏览的 [Fuwari 博客改造计划：文章置顶与置底](https://www.google.com/search?q=http://localhost:4321/posts/fuwari%25E5%258D%259A%25E5%25AE%25A2%25E6%2594%25B9%25E9%2580%25A0%25E8%25AE%25A1%25E5%2588%2592%25E6%2596%2587%25E7%25AB%25A0%25E7%25BD%25AE%25E9%25A1%25B6%25E4%25B8%258E%25E7%25BD%25AE%25E5%25BA%2595/)，该功能的项目架构可以拆解为**元数据定义、逻辑处理、内容应用**三个层面。

这种架构的核心思想是：**通过在 Markdown 的 Frontmatter 中注入权重因子，改变静态生成的排序算法。**


### 1. 数据结构层 (Data Schema)

**位置**：`src/content.config.ts` (或旧版的 `src/content/config.ts`)

这是架构的“地基”。通过 Zod 模式为文章增加一个可选的优先级字段。

  * **新增字段**：`order` (类型: `number`)
  * **语义约定**：
      * `1`：置顶 (Top)
      * `0`：默认 (Normal)
      * `-1`：置底 (Bottom)

### 2. 逻辑处理层 (Logic Layer)

**位置**：`src/utils/content-utils.ts`

这是架构的“大脑”，负责重写 `getSortedPosts` 函数。排序逻辑由单一的“时间维度”变为\*\*“权重 + 时间”的双重维度\*\*。

#### 排序算法伪代码：

$$Score = (Order \times \infty) + Timestamp$$

1.  **第一优先级**：比较 `order` 字段。数值大的（置顶）排在前面。
2.  **第二优先级**：当 `order` 相同时，比较 `published` 日期。最近发布的排在前面。

### 3. 内容声明层 (Content Layer)

**位置**：`src/content/posts/*.md`

这是架构的“输入端”。开发者在编写文章时，通过 YAML 语法声明权重。

```yaml
---
title: "我的置顶公告"
published: 2024-01-01
order: 1  # 显式声明置顶
---
```


### 架构流程图

1.  **读取阶段**：Astro 调用 `getCollection('posts')` 获取所有原始 Markdown 数据。
2.  **计算阶段**：`content-utils.ts` 执行 `sort()` 插件。
      * 如果 $A.order > B.order$，则 A 排在 B 前。
      * 如果 $A.order == B.order$，比较 $Date(A)$ 与 $Date(B)$。
3.  **渲染阶段**：
      * **首页/列表页**：按计算后的顺序循环渲染卡片。
      * **上下文导航**：由于排序已变，文章底部的“上一篇/下一篇”链接也会自动根据新顺序重新绑定，确保阅读体验连贯。

___

## 实操


### 第一步：扩展内容配置字段[#](https://blog.7003410.xyz/posts/post-pinning-feature/#%E7%AC%AC%E4%B8%80%E6%AD%A5%E6%89%A9%E5%B1%95%E5%86%85%E5%AE%B9%E9%85%8D%E7%BD%AE%E5%AD%97%E6%AE%B5)

首先，在 `src/content/config.ts` 中为文章元数据添加 `order` 字段，用于标识文章的显示优先级：

```php
import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    published: z.date(),
    updated: z.date().optional(),
    draft: z.boolean().optional().default(false),
    description: z.string().optional().default(""),
    image: z.string().optional().default(""),
    tags: z.array(z.string()).optional().default([]),
    category: z.string().optional().nullable().default(""),
    lang: z.string().optional().default(""),
    order: z.number().default(0), // 新增字段：0=默认, 1=置顶, -1=置底
    /* For internal use */
    prevTitle: z.string().default(""),
    prevSlug: z.string().default(""),
    nextTitle: z.string().default(""),
    nextSlug: z.string().default(""),
  }),
});

export const collections = {
  posts: postsCollection,
};
```

> **说明**：
> 
> -   `order: 1` 表示该文章将被置顶；
> -   `order: -1` 表示置底；
> -   默认值 `0` 保持原有排序行为。

___

### 第二步：调整文章排序逻辑[#](https://blog.7003410.xyz/posts/post-pinning-feature/#%E7%AC%AC%E4%BA%8C%E6%AD%A5%E8%B0%83%E6%95%B4%E6%96%87%E7%AB%A0%E6%8E%92%E5%BA%8F%E9%80%BB%E8%BE%91)

接下来，修改 `src/utils/content-utils.ts` 中的排序函数，使文章按 `order` 优先级排序，再按发布时间降序排列：

```javascript
async function getRawSortedPosts() {
  const allBlogPosts = await getCollection("posts", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  // 自定义排序逻辑
  const sorted = allBlogPosts.sort((a, b) => {
    // 第一优先级：按 order 字段排序（1 > 0 > -1）
    if (a.data.order !== b.data.order) {
      return b.data.order - a.data.order; // 降序：置顶(1)在前，置底(-1)在后
    }

    // 第二优先级：order 相同时，按发布日期倒序（新文章在前）
    const dateA = new Date(a.data.published);
    const dateB = new Date(b.data.published);
    return dateA > dateB ? -1 : 1;
  });

  return sorted;
}

export async function getSortedPosts() {
  const sorted = await getRawSortedPosts();

  // 保持原有的前后文章链接逻辑不变
  for (let i = 1; i < sorted.length; i++) {
    sorted[i].data.nextSlug = sorted[i - 1].slug;
    sorted[i].data.nextTitle = sorted[i - 1].data.title;
  }
  for (let i = 0; i < sorted.length - 1; i++) {
    sorted[i].data.prevSlug = sorted[i + 1].slug;
    sorted[i].data.prevTitle = sorted[i + 1].data.title;
  }

  return sorted;
}
```

### 第三步 ： 添加置顶图标提示

在 src/components/PostCard.astro 中，插入置顶图标的代码：
```
{entry.data.order === 1 && <Icon class="inline text-[var(--primary)] mr-2 -translate-y-1" name="material-symbols:keep-outline-rounded" />}
```

  它是如何实现置顶符号提示的？

   1. 条件渲染：
      在渲染文章标题之前，程序会检查 entry.data.order 的值。如果其值恰好等于 1，就会渲染一个图标。

   2. 图标选择：
      使用的是 material-symbols:keep-outline-rounded 图标，这通常是一个类似“图钉”或“书签”的图标（在 Material
  Symbols 中 keep 对应的是图钉）。

  注意事项：
   * 目前代码中的逻辑是 entry.data.order === 1。这意味着：
       * 如果 order: 1，会显示图标。
       * 如果 order: 2 或更大，虽然文章排在更前面，但不会显示这个图标。
       * 如果 order: -1 (置底)，自然也不会显示图标。

  如果你希望所有大于 0 的 order 都显示置顶图标，可以将该条件改为 entry.data.order > 0。
___

### 使用方式[#](https://blog.7003410.xyz/posts/post-pinning-feature/#%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F)

在任意 Markdown 文章的 Frontmatter 中添加 `order` 字段即可：

```yaml
---
title: 重要公告
order: 1  # 置顶
published: 2025-11-01
---
```

或

```yaml
---
title: 旧版使用说明
order: -1  # 置底
published: 2023-05-20
---
```

___

> **本文转载说明**
> * **原文标题：** [文章置顶与置底：Fuwari博客的功能增强（一）](https://blog.7003410.xyz/posts/post-pinning-feature/)
> * **原文作者：** [晓正杨](https://blog.7003410.xyz/posts/post-pinning-feature/)
> * **发布日期：** 2025-11-01
> * **许可协议：** [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)
> * **转载备注：** 本文出于技术交流目的进行转载，转载请遵循原作者指定的授权协议。

---
