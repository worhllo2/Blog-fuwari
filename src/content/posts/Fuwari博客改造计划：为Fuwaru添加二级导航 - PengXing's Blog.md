---
title: FUwari 二级导航改造教程
published: 2026-03-30
description: '为 Fuwari 主题添加二级导航支持，实现桌面端悬停展开与移动端点击切换功能。'
image: ''
tags: ['Astro', 'Fuwari', '前端开发', '博客改造']
category: '博客改造'
ai: '本文详细介绍了如何通过修改源码为 Astro 的 Fuwari 主题增加二级菜单嵌套功能。'
draft: false 
lang: 'zh-CN'
order: 0
---

## 前言
Fuwari 的简约美一直深得我心，但“鱼和熊掌不可兼得”，极简的设计往往意味着功能的取舍。为了在不破坏原主题美感的前提下增加导航深度，我参考了- [FUwari 二级导航 - PengXing's Blog](https://pengxing.dpdns.org/posts/fuwari_secondary_navigation/)的方案。这套二级导航方案动画丝滑，完美契合了原主题的 UI 风格。


## 设计架构

### 1. 数据层 (Data Layer)
在 `src/config.ts` 中，导航栏不再是简单的平级数组，而是引入了**嵌套结构**。
* **父级节点**：包含 `name` 和 `url`（通常设为 `#`）。
* **子级节点 (`children`)**：一个可选的数组，存放子菜单的对象。
* **属性标记**：通过 `external: true` 标记外部链接，以便在渲染时自动添加图标和 `_blank` 属性。

### 2. 类型层 (Type Layer)
在 `src/types/config.ts` 中，通过 [TypeScript](https://pengxing.dpdns.org/posts/fuwari_secondary_navigation/#srctypesconfigts) 定义了递归或嵌套的接口：
* 扩展了原有的 `NavBarLink` 类型，增加了一个可选属性 `children?: NavBarLink[]`。这允许导航项持有与之结构相同的子项。

### 3. 渲染层 (Rendering Layer)
这一层由两个核心 Astro 组件组成，分别处理不同的终端显示：

* **桌面端 (Navbar.astro)**：
    * **逻辑控制**：使用 `map` 循环遍历 `links`，通过 `if (l.children)` 判断是否渲染下拉菜单。
    * **布局实现**：父容器设为 `relative group`。
    * **显示逻辑**：利用 Tailwind 的 `group-hover` 类（如 `group-hover:opacity-100`），实现鼠标悬停时下方 `absolute` 定位的菜单面板由隐变现。

* **移动端 (NavMenuPanel.astro)**：
    * **垂直布局**：子菜单不再是悬浮框，而是嵌套在侧边栏列表中的伸缩项。
    * **状态标识**：包含一个箭头图标（`nav-submenu-arrow`），通过 CSS 类控制旋转角度来暗示展开状态。

### 4. 交互层 (Interaction Layer)
由于 Astro 默认不带客户端 JS，作者在 `NavMenuPanel.astro` 中注入了 `<script>` 脚本来处理移动端点击：
* **高度过渡**：通过监听 `click` 事件，动态计算 `scrollHeight` 并赋值给 `maxHeight`。这种方式比简单的 `display: block` 动画效果更丝滑。
* **旋转动画**：同步修改箭头图标的 `transform` 属性。

## 二级菜单配置[#](https://pengxing.dpdns.org/posts/fuwari_secondary_navigation/#%E4%BA%8C%E7%BA%A7%E8%8F%9C%E5%8D%95%E9%85%8D%E7%BD%AE)

在导航栏配置中支持二级菜单，可以创建下拉菜单结构：

**配置说明：**

-   `name` - 菜单显示名称
-   `url` - 链接地址（父级菜单建议使用 `#`）
-   `children` - 子菜单数组
-   `external` - 是否为外部链接

**功能特性：**

-   桌面端：鼠标悬停展开二级菜单
    
-   移动端：点击切换二级菜单显示/隐藏
    
-   支持无限层级嵌套
    
-   自动适应内容宽度
    

```ruby
export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
    LinkPreset.Series,
    LinkPreset.Friends,
    LinkPreset.Donate,
    {
      name: "其他", // 标题
      url: "#", // 内部链接不应包含基本路径，因为它是自动添加的
      children: [
        {
          name: "访客统计",
          url: "https://cloud.umami.is/share/i6f3UwPY4n0w1LJa/pengxing.dpdns.org", // 内部链接不应包含基本路径，因为它是自动添加的
          external: true, //显示外部链接图标，并将在新选项卡中打开
        },
        {
          name: "网盘资源",
          url: "https://docs.qq.com/aio/DYmZYVGpFVGxOS3NE", // 内部链接不应包含基本路径，因为它是自动添加的
          external: true, //显示外部链接图标，并将在新选项卡中打开
        },
      ],
    },
  ],
};
```

## 修改代码[#](https://pengxing.dpdns.org/posts/fuwari_secondary_navigation/#%E4%BF%AE%E6%94%B9%E4%BB%A3%E7%A0%81)

### src/components/Navbar.astro[#](https://pengxing.dpdns.org/posts/fuwari_secondary_navigation/#srccomponentsnavbarastro)

```php
---
import { Icon } from "astro-icon/components";
import { navBarConfig, siteConfig } from "../config";
import { LinkPresets } from "../constants/link-presets";
import { LinkPreset, type NavBarLink } from "../types/config";
import { url } from "../utils/url-utils";
import LightDarkSwitch from "./LightDarkSwitch.svelte";
import Search from "./Search.svelte";
import DisplaySettings from "./widget/DisplaySettings.svelte";
import NavMenuPanel from "./widget/NavMenuPanel.astro";

const className = Astro.props.class;

let links: NavBarLink[] = navBarConfig.links.map(
  (item: NavBarLink | LinkPreset): NavBarLink => {
    if (typeof item === "number") {
      return LinkPresets[item];
    }
    return item;
  },
);
---
<div id="navbar" class="z-50 onload-animation">
    <div class="absolute h-8 left-0 right-0 -top-8 bg-[var(--card-bg)] transition"></div> <!-- used for onload animation -->
    <div class:list={[
        className,
        "card-base !overflow-visible max-w-[var(--page-width)] h-[4.5rem] !rounded-t-none mx-auto flex items-center justify-between px-4"]}>
        <a href={url('/')} class="btn-plain scale-animation rounded-lg h-[3.25rem] px-5 font-bold active:scale-95">
            <div class="flex flex-row text-[var(--primary)] items-center text-md">
                <Icon name="material-symbols:home-outline-rounded" class="text-[1.75rem] mb-1 mr-2" />
                {siteConfig.title}
            </div>
        </a>
        <div class="hidden md:flex">
            {links.map((l) => {
                // return <a aria-label={l.name} href={l.external ? l.url : url(l.url)} target={l.external ? "_blank" : null}
                //           class="btn-plain scale-animation rounded-lg h-11 font-bold px-5 active:scale-95"
                // >
                //     <div class="flex items-center">
                //         {l.name}
                //         {l.external && <Icon name="fa6-solid:arrow-up-right-from-square" class="text-[0.875rem] transition -translate-y-[1px] ml-1 text-black/[0.2] dark:text-white/[0.2]"></Icon>}
                //     </div>
                // </a>;
                if (l.children && l.children.length > 0) {
                    // 有子菜单的情况
                    return <div class="relative group">
                        <button class="btn-plain scale-animation rounded-lg h-11 font-bold px-5 active:scale-95 flex items-center">
                            {l.name}
                            <Icon name="material-symbols:keyboard-arrow-down-rounded" class="text-[1.25rem] ml-1 transition-transform group-hover:rotate-180"></Icon>
                        </button>
                        <div class="absolute top-full left-0 mt-2 min-w-max bg-[var(--card-bg)] border border-[var(--line-divider)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                            {l.children.map((child) => (
                                 <a href={child.external ? child.url : url(child.url)} target={child.external ? "_blank" : null}
                                    class="btn-plain scale-animation block px-4 py-3 text-sm font-bold hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] first:rounded-t-lg last:rounded-b-lg transition-all duration-200 active:scale-95 mx-1 my-0.5 rounded-lg">
                                     <div class="flex items-center justify-between">
                                         {child.name}
                                         {child.external && <Icon name="fa6-solid:arrow-up-right-from-square" class="text-[0.75rem] text-black/[0.2] dark:text-white/[0.2]"></Icon>}
                                     </div>
                                 </a>
                             ))}
                        </div>
                    </div>;
                } else {
                    // 没有子菜单的情况
                    return <a aria-label={l.name} href={l.external ? l.url : url(l.url)} target={l.external ? "_blank" : null}
                              class="btn-plain scale-animation rounded-lg h-11 font-bold px-5 active:scale-95"
                    >
                        <div class="flex items-center">
                            {l.name}
                            {l.external && <Icon name="fa6-solid:arrow-up-right-from-square" class="text-[0.875rem] transition -translate-y-[1px] ml-1 text-black/[0.2] dark:text-white/[0.2]"></Icon>}
                        </div>
                    </a>;
                }

            })}
        </div>
        <div class="flex">
            <!--<SearchPanel client:load>-->
            <Search client:only="svelte"></Search>
            {!siteConfig.themeColor.fixed && (
                    <button aria-label="Display Settings" class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" id="display-settings-switch">
                        <Icon name="material-symbols:palette-outline" class="text-[1.25rem]"></Icon>
                    </button>
            )}
            <LightDarkSwitch client:only="svelte"></LightDarkSwitch>
            <button aria-label="Menu" name="Nav Menu" class="btn-plain scale-animation rounded-lg w-11 h-11 active:scale-90 md:!hidden" id="nav-menu-switch">
                <Icon name="material-symbols:menu-rounded" class="text-[1.25rem]"></Icon>
            </button>
        </div>
        <NavMenuPanel links={links}></NavMenuPanel>
        <DisplaySettings client:only="svelte"></DisplaySettings>
    </div>
</div>

<script>
function switchTheme() {
    if (localStorage.theme === 'dark') {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    }
}

function loadButtonScript() {
    let switchBtn = document.getElementById("scheme-switch");
    if (switchBtn) {
        switchBtn.onclick = function () {
            switchTheme()
        };
    }

    let settingBtn = document.getElementById("display-settings-switch");
    if (settingBtn) {
        settingBtn.onclick = function () {
            let settingPanel = document.getElementById("display-setting");
            if (settingPanel) {
                settingPanel.classList.toggle("float-panel-closed");
            }
        };
    }

    let menuBtn = document.getElementById("nav-menu-switch");
    if (menuBtn) {
        menuBtn.onclick = function () {
            let menuPanel = document.getElementById("nav-menu-panel");
            if (menuPanel) {
                menuPanel.classList.toggle("float-panel-closed");
            }
        };
    }
}

loadButtonScript();
</script>

{import.meta.env.PROD && <script is:inline define:vars={{scriptUrl: url('/pagefind/pagefind.js')}}>
async function loadPagefind() {
    try {
        const response = await fetch(scriptUrl, { method: 'HEAD' });
        if (!response.ok) {
            throw new Error(`Pagefind script not found: ${response.status}`);
        }

        const pagefind = await import(scriptUrl);

        await pagefind.options({
            excerptLength: 20
        });

        window.pagefind = pagefind;

        document.dispatchEvent(new CustomEvent('pagefindready'));
        console.log('Pagefind loaded and initialized successfully, event dispatched.');
    } catch (error) {
        console.error('Failed to load Pagefind:', error);
        window.pagefind = {
            search: () => Promise.resolve({ results: [] }),
            options: () => Promise.resolve(),
        };
        document.dispatchEvent(new CustomEvent('pagefindloaderror'));
        console.log('Pagefind load error, event dispatched.');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPagefind);
} else {
    loadPagefind();
}
</script>}
```

### src/components/widget/NavMenuPanel.astro[#](https://pengxing.dpdns.org/posts/fuwari_secondary_navigation/#srccomponentswidgetnavmenupanelastro)

```php
---
import { Icon } from "astro-icon/components";
import { type NavBarLink } from "../../types/config";
import { url } from "../../utils/url-utils";

interface Props {
  links: NavBarLink[];
}

const links = Astro.props.links;
---
<div id="nav-menu-panel" class:list={["float-panel float-panel-closed absolute transition-all fixed right-4 px-2 py-2"]}>
    <!-- {links.map((link) => (
        <a href={link.external ? link.url : url(link.url)} class="group flex justify-between items-center py-2 pl-3 pr-1 rounded-lg gap-8
            hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] transition
        "
           target={link.external ? "_blank" : null}
        >
            <div class="transition text-black/75 dark:text-white/75 font-bold group-hover:text-[var(--primary)] group-active:text-[var(--primary)]">
                {link.name}
            </div>
            {!link.external && <Icon name="material-symbols:chevron-right-rounded"
                  class="transition text-[1.25rem] text-[var(--primary)]"
            >
            </Icon>}
            {link.external && <Icon name="fa6-solid:arrow-up-right-from-square"
                  class="transition text-[0.75rem] text-black/25 dark:text-white/25 -translate-x-1"
            >
            </Icon>}
        </a>
    ))} -->
    {links.map((link) => {
        if (link.children && link.children.length > 0) {
            // 有子菜单的情况
            return (
                <div class="nav-menu-item-with-children">
                    <button class="group flex justify-between items-center py-2 pl-3 pr-1 rounded-lg gap-8 w-full
                        hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] transition
                        nav-submenu-toggle"
                    >
                        <div class="transition text-black/75 dark:text-white/75 font-bold group-hover:text-[var(--primary)] group-active:text-[var(--primary)]">
                            {link.name}
                        </div>
                        <Icon name="material-symbols:keyboard-arrow-down-rounded"
                              class="transition text-[1.25rem] text-[var(--primary)] nav-submenu-arrow"
                        >
                        </Icon>
                    </button>
                    <div class="nav-submenu pl-4 max-h-0 overflow-hidden transition-all duration-200">
                        {link.children.map((child) => (
                            <a href={child.external ? child.url : url(child.url)} class="group flex justify-between items-center py-2 pl-3 pr-1 rounded-lg gap-8
                                hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] transition
                            "
                               target={child.external ? "_blank" : null}
                            >
                                <div class="transition text-black/60 dark:text-white/60 text-sm group-hover:text-[var(--primary)] group-active:text-[var(--primary)]">
                                    {child.name}
                                </div>
                                {!child.external && <Icon name="material-symbols:chevron-right-rounded"
                                      class="transition text-[1rem] text-[var(--primary)]"
                                >
                                </Icon>}
                                {child.external && <Icon name="fa6-solid:arrow-up-right-from-square"
                                      class="transition text-[0.65rem] text-black/25 dark:text-white/25 -translate-x-1"
                                >
                                </Icon>}
                            </a>
                        ))}
                    </div>
                </div>
            );
        } else {
            // 没有子菜单的情况
            return (
                <a href={link.external ? link.url : url(link.url)} class="group flex justify-between items-center py-2 pl-3 pr-1 rounded-lg gap-8
                    hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] transition
                "
                   target={link.external ? "_blank" : null}
                >
                    <div class="transition text-black/75 dark:text-white/75 font-bold group-hover:text-[var(--primary)] group-active:text-[var(--primary)]">
                        {link.name}
                    </div>
                    {!link.external && <Icon name="material-symbols:chevron-right-rounded"
                          class="transition text-[1.25rem] text-[var(--primary)]"
                    >
                    </Icon>}
                    {link.external && <Icon name="fa6-solid:arrow-up-right-from-square"
                          class="transition text-[0.75rem] text-black/25 dark:text-white/25 -translate-x-1"
                    >
                    </Icon>}
                </a>
            );
        }
    })}
</div>

<script>
    // 移动端二级菜单展开/收起功能
    document.addEventListener('DOMContentLoaded', function() {
        const submenuToggles = document.querySelectorAll('.nav-submenu-toggle');

        submenuToggles.forEach(toggle => {
            toggle.addEventListener('click', function(this: HTMLElement) {
                const submenu = this.parentElement?.querySelector('.nav-submenu') as HTMLElement;
                const arrow = this.querySelector('.nav-submenu-arrow') as HTMLElement;

                if (submenu && arrow) {
                    const isExpanded = submenu.style.maxHeight && submenu.style.maxHeight !== '0px';

                    if (isExpanded) {
                        submenu.style.maxHeight = '0px';
                        arrow.style.transform = 'rotate(0deg)';
                    } else {
                        submenu.style.maxHeight = submenu.scrollHeight + 'px';
                        arrow.style.transform = 'rotate(180deg)';
                    }
                }
            });
        });
    });
</script>
```



### src/types/config.ts[#](https://pengxing.dpdns.org/posts/fuwari_secondary_navigation/#srctypesconfigts)

```typescript
// 。。。。只需要修改这一处,其他保存不变

export type NavBarLink = {
  name: string;
  url: string;
  external?: boolean;
  children?: NavBarLink[]; // 支持二级菜单
};


// 。。。。只需要修改这一处,其他保存不变
```
## 转载说明

> **转载说明：**
> 本文转载自 [鹏星](https://pengxing.dpdns.org/) 的博客文章 [《FUwari 二级导航》](https://pengxing.dpdns.org/posts/fuwari_secondary_navigation/)。内容基于 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 协议分享，感谢原作者的硬核教程！

