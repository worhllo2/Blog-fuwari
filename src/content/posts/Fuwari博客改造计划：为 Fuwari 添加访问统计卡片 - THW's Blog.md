---
title: 为 Fuwari 博客添加 Umami 访问统计卡片
published: 2026-03-30
description: '本文详细介绍了如何通过 Umami API 获取站点数据，并为 Fuwari 主题自定义开发一个优雅的侧边栏访问统计组件。'
image: ''
tags: ['Fuwari', 'Astro', 'Umami', '博客优化']
category: '博客改造'
ai: '本文介绍了集成 Umami 统计 API 的具体代码实现与组件配置过程。'
draft: false 
lang: 'zh-CN'
order: 0
---

## 开始[#](https://blog.tianhw.top/posts/fuwari-umami-stats/#%E5%BC%80%E5%A7%8B)

搭建好博客网站之后，我们通常都有查看访问数据的需求。作为静态博客，在不自建服务器的情况下通常都是使用类似Umami的外部网站分析工具（Umami确实好用），但是当我们希望向访客展示自己的访问数据时，就只能在网站上挂一个Umami分享的外链，非常的不优雅。

![统计信息小卡片](https://blog.tianhw.top/_astro/card_Z2bc1IP.webp) 于是我将Umami统计信息做成了小组件放在了页面左侧，效果还是不错的。那么，教程开始。

## 教程[#](https://blog.tianhw.top/posts/fuwari-umami-stats/#%E6%95%99%E7%A8%8B)

### 准备[#](https://blog.tianhw.top/posts/fuwari-umami-stats/#%E5%87%86%E5%A4%87)

-   一个已部署好的fuwari博客
-   启用Umami统计的站点（如果你不知道什么是umami，请先自行搜索教程后继续阅读）

### 获取数据[#](https://blog.tianhw.top/posts/fuwari-umami-stats/#%E8%8E%B7%E5%8F%96%E6%95%B0%E6%8D%AE)
“
![umami页面](https://blog.tianhw.top/_astro/umami_ZfGL0Y.webp) 为了获取到图中的这些数据，我们需要先首先我们启用Umami统计的分享URL

你应该会得到一个`https://cloud.umami.is/analytics/us/share/EkS4mYbIXLu9vshR`这个样子的URL，以我的这个为例，我们需要的是最后这一串`EkS4mYbIXLu9vshR`

接着我们去浏览器访问`https://cloud.umami.is/analytics/us/api/share/EkS4mYbIXLu9vshR`（注意这里的`EkS4mYbIXLu9vshR`要替换为上一步中你自己的），就会得到以下数据：

```json
{
  "websiteId": "42d4c606-856f-4026-906c-65bbcb4c5ac1",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3ZWJzaXRlSWQiOiI0MmQ0YzYwNi04NTZmLTQwMjYtOTA2Yy02NWJiY2I0YzVhYzEiLCJpYXQiOjE3NjAzNjczOTJ9.JWtW668hYoeiKTZSkxZ8suW7RZnmzn0Pa0CHN2xpJYU"
}
```

记下来，稍后有用。

### 添加组件[#](https://blog.tianhw.top/posts/fuwari-umami-stats/#%E6%B7%BB%E5%8A%A0%E7%BB%84%E4%BB%B6)

#### 创建组件[#](https://blog.tianhw.top/posts/fuwari-umami-stats/#%E5%88%9B%E5%BB%BA%E7%BB%84%E4%BB%B6)

在 `src/components/widget/` 目录下创建 `UmamiStats.astro` 文件，代码如下：

```php
---
import WidgetLayout from "./WidgetLayout.astro";

interface Props {
  class?: string;
  style?: string;
}
const { class: className, style } = Astro.props;
---

<WidgetLayout name="统计" id="umami-stats" class:list={[className]} {style}>
    <div class="text-center py-2">
        <div class="text-3xl font-bold text-neutral-900 dark:text-neutral-100" id="total-pageviews">-</div>
        <div class="text-sm text-neutral-500 dark:text-neutral-400">总浏览量</div>
    </div>
    <div class="grid grid-cols-2 divide-x divide-neutral-200 dark:divide-neutral-700 text-center pt-2">
        <div class="px-2">
            <div class="text-xl font-bold text-neutral-900 dark:text-neutral-100" id="total-visits">-</div>
            <div class="text-sm text-neutral-500 dark:text-neutral-400">访问数</div>
        </div>
        <div class="px-2">
            <div class="text-xl font-bold text-neutral-900 dark:text-neutral-100" id="total-visitors">-</div>
            <div class="text-sm text-neutral-500 dark:text-neutral-400">游客数</div>
        </div>
    </div>
</WidgetLayout>

<script>
const UMAMI_CONFIG = {
    baseUrl: 'https://cloud.umami.is/analytics/us/api', // 如果你选的区域是欧盟，请改为 https://cloud.umami.is/analytics/eu/api
    websiteId: '上一步获得的websiteId（也就是短的那个）',
    shareToken: '上一步获得的token（也就是长的那个）'
};

function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

async function fetchUmamiStats() {
    try {
        const endAt = Date.now();
        const startAt = 0;

        const url = `${UMAMI_CONFIG.baseUrl}/websites/${UMAMI_CONFIG.websiteId}/stats?startAt=${startAt}&endAt=${endAt}&unit=hour&timezone=Asia%2FShanghai`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'x-umami-share-token': UMAMI_CONFIG.shareToken
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const pageviewsElement = document.getElementById('total-pageviews');
        const visitsElement = document.getElementById('total-visits');
        const visitorsElement = document.getElementById('total-visitors');

        if (pageviewsElement) {
            pageviewsElement.textContent = formatNumber(data.pageviews || 0);
        }

        if (visitsElement) {
            visitsElement.textContent = formatNumber(data.visits || 0);
        }

        if (visitorsElement) {
            visitorsElement.textContent = formatNumber(data.visitors || 0);
        }

    } catch (error) {
        console.error('获取Umami统计数据失败:', error);
        const elements = ['total-pageviews', 'total-visits', 'total-visitors'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '获取失败';
                element.classList.add('text-red-500');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', fetchUmamiStats);

if (window.swup) {
    window.swup.hooks.on('page:view', fetchUmamiStats);
}
</script>
```

#### 配置参数[#](https://blog.tianhw.top/posts/fuwari-umami-stats/#%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0)

在上面的代码中，记得要替换以下配置：

> WARNING
> 
> 如果你的 Umami 注册时数据存储区域选择的是 **欧盟**，请将 `baseUrl` 改为 `https://cloud.umami.is/analytics/eu/api`。

```csharp
const UMAMI_CONFIG = {
    baseUrl: 'https://cloud.umami.is/analytics/us/api',
    websiteId: '上一步获得的websiteId（也就是短的那个）',
    shareToken: '上一步获得的token（也就是长的那个）'
};
```

#### 添加到侧边栏组件[#](https://blog.tianhw.top/posts/fuwari-umami-stats/#%E6%B7%BB%E5%8A%A0%E5%88%B0%E4%BE%A7%E8%BE%B9%E6%A0%8F%E7%BB%84%E4%BB%B6)

在 `src/components/widget/SideBar.astro` 中导入此组件：

```typescript
---
import { Image } from "astro:assets";
import type { MarkdownHeading } from "astro";
import { Icon } from "astro-icon/components";
import Categories from "./Categories.astro";
import Profile from "./Profile.astro";
import Sponsors from "./Sponsors.astro";
import UmamiStats from "./UmamiStats.astro";
import VisitorIP from "./VisitorIP.astro";

interface Props {
  class?: string;
  headings?: MarkdownHeading[];
}

const className = Astro.props.class;
---
<div id="sidebar" class:list={[className, "w-full"]}>
    <div class="flex flex-col w-full gap-4 mb-4">
        <Profile></Profile>
    </div>
    <div id="sidebar-sticky" class="transition-all duration-700 flex flex-col w-full gap-4 top-4 sticky top-4">
        <Categories class="onload-animation" style="animation-delay: 150ms"></Categories>
        <UmamiStats class="onload-animation" style="animation-delay: 200ms"></UmamiStats>
        <VisitorIP class="onload-animation" style="animation-delay: 225ms"></VisitorIP>
        <Sponsors class="onload-animation" style="animation-delay: 250ms"></Sponsors>
    </div>
</div>
```

### 自定义[#](https://blog.tianhw.top/posts/fuwari-umami-stats/#%E8%87%AA%E5%AE%9A%E4%B9%89)

如果你按照上述的步骤操作，那么你应该就能在页面左侧下方看到你的博客浏览量统计了，下面是自定义的教程：

#### 修改统计周期[#](https://blog.tianhw.top/posts/fuwari-umami-stats/#%E4%BF%AE%E6%94%B9%E7%BB%9F%E8%AE%A1%E5%91%A8%E6%9C%9F)

默认为 **所有时间** ，如果你想要调整浏览量统计的时间范围，你需要修改`UmamiStats.astro` 文件的 startAt 参数(默认是所有时间)。 例如改为最近30天的数据，也就是30天×24小时×60分钟×60秒×1000毫秒=`2592000000`：

```javascript
try {
    const endAt = Date.now();
    const startAt = 0;
    const startAt = Date.now() - 2592000000;
```

同理，如果你想改为最近90天的数据，只需要减去90天×24小时×60分钟×60秒×1000毫秒即可。

## 结尾[#](https://blog.tianhw.top/posts/fuwari-umami-stats/#%E7%BB%93%E5%B0%BE)

通过以上步骤，你就成功为 Fuwari 添加了基于 Umami 的网站访问统计卡片，同时还支持明/暗模式切换。以后只要有访客查看，统计卡片数据都会自动更新。