---
title: 'Fuwari 博客改造计划：为侧边栏添加音乐播放器卡片'
published: 2026-04-05
description: '本文介绍了如何在 Fuwari 主题中通过封装 Astro 组件，集成 Aplayer 和 MetingJS，在侧边栏实现一个支持全局播放、自动销毁实例且高度契合主题样式的音乐播放器卡片。'
image: 'https://imgbed.142588.xyz/file/1774865152688_image.png' # 建议确认实际图片路径
tags: ['Aplayer', 'Astro', 'Fuwari', '前端开发']
category: '博客改造'
ai: '本文详细记录了在 Astro 框架下集成音乐播放器的过程，重点解决了 Swup 路由切换导致的实例残留问题，提供了完整的组件封装代码。'
draft: false 
lang: 'zh-CN'
order: 0
---

## 为什么选择侧边栏？

Fuwari 默认的 Aplayer 通常固定在左下角，虽然功能完整，但在视觉上略显突兀，且容易遮挡页面内容。通过将播放器封装为侧边栏卡片，不仅能让博客界面更加整洁、原生，还能利用 Fuwari 优秀的侧边栏粘性（Sticky）效果，让音乐控制始终触手可及。

## 设计架构

为了在 Astro 这种静态站点生成器中实现一个稳定、不重叠的音乐播放器，我们采用了以下分层架构：

### 1. 组件封装层 (Component Layer)
使用 `MusicPlayer.astro` 作为核心。它负责：
- **资源注入**：按需引入 APlayer 和 MetingJS 的 CDN 脚本与样式。
- **DOM 占位**：提供一个标准的 `card-base` 容器，确保视觉样式与主题统一。
- **配置声明**：通过 Data Attributes（在脚本中动态设置）定义歌单来源。

### 2. 生命周期管理层 (Lifecycle Management)
由于 Fuwari 使用了 Swup 进行无刷新跳转，传统的脚本执行逻辑会失效。我们构建了一个闭环的生命周期：
- **初始化 (Init)**：在 `DOMContentLoaded` 和 `astro:page-load` 时触发，确保首次进入或刷新页面时播放器可用。
- **清理 (Cleanup)**：在 Swup 的 `content:replace` 阶段，主动调用 `aplayer.destroy()`。这是**防止多重音轨叠加**的核心逻辑。
- **重建 (Rebuild)**：在 Swup 的 `page:view` 阶段重新实例化，确保在切换页面后播放器依然存在于新的侧边栏 DOM 中。

### 3. 数据与逻辑通信 (Data & Logic)
- **全局单例**：将 APlayer 实例挂载到 `window.musicPlayerInstance`，实现跨组件、跨页面的实例追踪。
- **异步适配**：由于 MetingJS 是异步渲染 DOM，架构中包含了一个**轮询捕获机制**，确保在 DOM 准备就绪后再绑定实例控制权。

---

## 核心实现步骤

### 1. 创建 MusicPlayer 组件

创建文件 `src/components/MusicPlayer.astro`：

```astro
---
---
<!-- 引入 APlayer 和 MetingJS 的 CDN 资源 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css" />
<script is:inline src="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js"></script>
<script is:inline src="https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js"></script>

<div class="pb-4 card-base">
    <!-- 卡片标题样式，契合 Fuwari 主题 -->
    <div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-8 mt-4 mb-2
      before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
      before:absolute before:left-[-16px] before:top-[5.5px]">
        音乐
    </div>

    <!-- 播放器容器 -->
    <div class="px-4" id="music-player-container"></div>
</div>

<script is:inline>
// 全局变量存储播放器实例，用于后续销毁
window.musicPlayerInstance = null;

function initMusicPlayer() {
    // 1. 销毁已存在的实例，防止页面切换后出现多个播放器叠加或报错
    if (window.musicPlayerInstance) {
        try {
            window.musicPlayerInstance.destroy();
        } catch (e) {
            console.error('销毁旧播放器实例失败:', e);
        }
        window.musicPlayerInstance = null;
    }

    // 2. 清除并重建容器
    const container = document.getElementById('music-player-container');
    if (!container) return;
    container.innerHTML = '';

    // 3. 动态创建 meting-js 元素
    const metingElement = document.createElement('meting-js');
    metingElement.setAttribute('server', 'netease'); 
    metingElement.setAttribute('type', 'playlist'); 
    metingElement.setAttribute('id', '2501170701'); 
    metingElement.setAttribute('fixed', 'false');  
    metingElement.setAttribute('autoplay', 'false');
    metingElement.setAttribute('theme', 'var(--primary)');
    metingElement.setAttribute('loop', 'all');
    metingElement.setAttribute('order', 'list');
    metingElement.setAttribute('preload', 'auto');
    metingElement.setAttribute('list-folded', 'true');
    metingElement.setAttribute('list-max-height', '300px');

    container.appendChild(metingElement);

    // 4. 手动触发 MetingJS 初始化
    if (typeof window.Meting === 'function') {
        window.Meting(metingElement);
    }

    // 5. 轮询获取生成的 APlayer 实例并存储
    let retryCount = 0;
    const maxRetries = 10;
    const checkAPlayer = () => {
        const aplayerElement = container.querySelector('.aplayer');
        if (aplayerElement && aplayerElement.aplayer) {
            window.musicPlayerInstance = aplayerElement.aplayer;
        } else if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(checkAPlayer, 200);
        }
    };
    checkAPlayer();
}

// 适配多种页面加载场景
document.addEventListener('DOMContentLoaded', initMusicPlayer);
document.addEventListener('astro:page-load', initMusicPlayer);

// 特别适配 Swup 路由切换
if (window.swup) {
    window.swup.hooks.on('content:replace', () => {
        if (window.musicPlayerInstance) {
            try {
                window.musicPlayerInstance.destroy();
            } catch (e) {
                console.log('Swup 切换时销毁播放器:', e);
            }
            window.musicPlayerInstance = null;
        }
    });
    window.swup.hooks.on('page:view', initMusicPlayer);
}
</script>
```

### 2. 集成到侧边栏

打开 `src/components/widget/SideBar.astro`，将刚才创建的组件引入并放置在合适的位置。

```astro
---
// ... 其他导入
import MusicPlayer from "../MusicPlayer.astro";
// ...
---
<div id="sidebar" class:list={[className, "w-full"]}>
    <!-- ... Profile 等组件 -->
    <div id="sidebar-sticky" ...>
        <Categories ... />
        <Tag ... />
        <!-- 在这里添加音乐播放器 -->
        <MusicPlayer class="onload-animation" style="animation-delay: 250ms" />
    </div>
</div>
```

## 技术细节说明

### Swup 路由适配
Fuwari 使用了 Swup 实现无刷新页面切换。如果不做处理，切换页面时旧的 APlayer 实例会残留在 DOM 之外继续工作，导致出现“重音”或者无法控制的情况。我们在脚本中监听了 `content:replace` 钩子，确保在页面内容更新前彻底销毁旧实例。

### 实例获取
由于 MetingJS 是异步生成 APlayer 结构的，我们使用了一个简单的 `setTimeout` 轮询机制来捕获生成的 `aplayer` 对象，以便我们在全局范围管理它。

## 如何自定义

你只需要修改 `MusicPlayer.astro` 中的 `meting-js` 属性：
- **server**: 平台（netease - 网易云，tencent - QQ音乐）。
- **id**: 歌单、专辑或单曲的 ID。
- **theme**: 播放器主色调，代码中已设为 `var(--primary)` 以匹配你的主题色。

## 结语

通过这种方式实现的音乐播放器，不仅外观上与 Fuwari 的卡片式设计完美融合，而且在性能和稳定性上也针对 Astro 的特性进行了优化。快去换上你喜欢的歌单吧！

---

## 参考与致谢

- **原始方案参考**：[fuwari主题侧边栏音乐播放器解决方案 - xagunelのblog](https://blog.xomoe.cn/posts/2025-08-22/musicplayer/)
- **技术支持**：APlayer & MetingJS
