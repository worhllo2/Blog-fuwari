---
     title: 如何为 Fuwari 博客添加一个精美的“友情链接”页面
     published: 2026-03-30
     description: '深入分析 Fuwari
      博客的友链实现架构，手把手教你如何通过数据层、内容层与渲染层的分离设计，快速构建一个支持暗色模式且易于维
      护的友链页面。'
     image: ''
     tags: ['Fuwari', 'Astro', '友情链接', '教程']
     category: '博客改造'
     ai: '本文详细介绍了在 Fuwari
      博客主题中添加友情链接页面的全过程。文章从架构设计的角度出发，将友链功能拆解为数据管理、内容说明和页面渲
      染三个核心模块，并提供了完整的代码实现方案。通过本教程，读者可以掌握如何在 Astro
      环境下实现“数据与表现分离”的开发模式，构建出具有响应式布局和暗色模式支持的精美友链页面。'
     draft: false
     lang: 'zh-CN'
     order: 0
---

 

  ## 前言
  在 Fuwari 这种基于 Astro
  架构的现代博客主题中，实现一个既美观又易于维护的“友情链接”页面，需要遵循其“数据与表现分离”的设计哲学。本文将
  带你拆解其架构，并手把手教你如何完成配置。

  ## 架构核心概念

  Fuwari 的友链功能由三个层次组成，这种设计确保了极高的加载性能和代码可维护性：

   1. 数据层 (src/friends_data.ts)：使用 TypeScript 数组管理具体的友链名单，确保类型安全。
   2. 内容层 (src/content/spec/friends.md)：利用 Astro 的 Content Collections
      管理页面的静态文字（如申请规则）。
   3. 渲染层 (src/pages/friends.astro)：负责将上述两者结合，并应用响应式布局和暗色模式样式。

  ---

  ## 实施步骤

  ### 第一步：定义友链数据

  在 src/ 目录下创建或编辑 friends_data.ts。我们将友链信息结构化，以便在页面中循环渲染。
```
     // src/friends_data.ts
    
     export interface Friend {
         name: string;        // 博客名称
         url: string;         // 博客链接
         avatar: string;      // 头像图片地址
         description: string; // 博客简短描述
     }
    
    export const friends: Friend[] = [
        {
            name: "示例好友",
            url: "https://example.com",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
            description: "这是一个非常酷的博客！",
        },
        // 在此处添加更多好友...
    ];
```

  ### 第二步：编写页面说明内容

  为了方便随时修改页面的文字介绍（如友链申请要求），我们使用 Markdown 文件。

  在 src/content/spec/ 目录下创建 friends.md：
```
   ---
     title: "友情链接"
     description: "我的朋友们"
     ---
    
     ## 📝 交换说明
    
     - **本站名称**: 你的博客名
     - **本站链接**: `https://yourblog.com`
    - **本站头像**: `https://yourblog.com/avatar.png`
    - **本站描述**: 风过留痕，雁过留声。
   
    > ⚠️ 申请前请先添加本站友链。网站需内容健康，且能够正常访问。
```


  ### 第三步：创建页面渲染模板

  这是最核心的部分，我们需要创建一个 Astro 页面来读取数据并生成 HTML。

  在 src/pages/ 目录下创建 friends.astro：

```
    2 import { getEntry, render } from "astro:content";
    3 import Markdown from "@components/misc/Markdown.astro";
    4 import MainGridLayout from "@layouts/MainGridLayout.astro";
    5 import { friends } from "../friends_data"; // 导入友链数据
    6
    7 // 1. 获取 Markdown 说明内容
    8 const friendsPost = await getEntry("spec", "friends");
    9 const { Content } = await render(friendsPost);
   10 ---
   11
   12 <MainGridLayout title="友情链接">
   13     <div class="card-base p-6 md:p-8">
   14         <!-- 页面大标题装饰 -->
   15         <div class="friends-bg-text">FRIENDS</div>
   16
   17         <!-- 渲染顶部的 Markdown 说明 -->
   18         <div class="mb-8">
   19             <Markdown class="mt-2">
   20                 <Content />
   21             </Markdown>
   22         </div>
   23
   24         <!-- 友链卡片网格系统 -->
   25         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
   26             {friends.map((friend) => (
   27                 <a href={friend.url} target="_blank" rel="noopener noreferrer" class="friend-card
      group">
   28                     <div class="flex items-center gap-3">
   29                         <img src={friend.avatar} class="w-10 h-10 rounded-lg transition-transform
      group-hover:rotate-12" alt={friend.name} />
   30                         <div class="font-bold text-black dark:text-white">{friend.name}</div>
   31                     </div>
   32                     <div class="text-sm text-black/50 dark:text-white/50 mt-2 line-clamp-1">
   33                         {friend.description}
   34                     </div>
   35                 </a>
   36             ))}
   37         </div>
   38     </div>
   39 </MainGridLayout>
   40
   41 <style>
   42 /* 标题装饰样式 */
   43 .friends-bg-text {
   44     @apply text-[60px] md:text-[100px] font-black text-center leading-none select-none mb-8;
   45     color: rgba(59, 130, 246, 0.08);
   46 }
   47
   48 /* 友链卡片基础样式 */
   49 .friend-card {
   50     @apply p-4 rounded-xl border border-black/5 dark:border-white/5 transition-all duration-300;
   51     background: linear-gradient(135deg, rgba(156, 163, 175, 0.05) 0%, rgba(209, 213, 219, 0.05) 100%);
   52 }
   53
   54 /* 悬停交互效果 */
   55 .friend-card:hover {
   56     @apply -translate-y-1 shadow-lg border-blue-400/30;
   57     background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.05) 100%);
   58 }
   59 </style>
```

  ### 第四步：配置导航栏入口

  最后，我们需要在博客顶部的导航栏中加入这个页面的入口。

  编辑 src/config.ts：
```
    1 export const navBarConfig: NavBarConfig = {
    2     links: [
    3         LinkPreset.Home,
    4         LinkPreset.Archive,
    5         {
    6             name: "友链",
    7             url: "/friends/", // 路径需与 pages 目录下的文件名对应
    8         },
    9         LinkPreset.About,
   10     ],
   11 };
```
  ---

  ## 架构优势总结

   1. 极速加载：友链数据在构建时即被静态化，无需在客户端请求 API，页面秒开。
   2. 样式统一：通过 MainGridLayout 自动继承了博客的侧边栏、背景和暗色模式切换逻辑。
   3. 维护简单：新增友链只需在 friends_data.ts 数组中增加一个对象，修改申请规则只需编辑 friends.md。

  现在，你的 Fuwari 博客已经拥有了一个具备精美悬停动画和响应式布局的友链页面了！🚀