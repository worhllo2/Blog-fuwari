---
title: 如何在 Fuwari 博客页脚添加 ICP 备案及运行时间
published: 2026-03-30
description: '本教程详细介绍了如何通过修改 src/components/Footer.astro 文件，为 Fuwari 主题添加自定义页脚信息，包括网站运行时间 JS 脚本、ICP 备案链接以及又拍云等赞助标识。'
image: '' 
tags: ['Fuwari', 'Astro', '前端开发', '博客改造']
category: '技术专栏'
ai: '本文提供了在 Astro 框架下 Fuwari 主题修改页脚布局的具体代码实现，包含运行时间统计脚本。'
draft: false 
lang: 'zh-CN'
order: 0
---

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

### 💡 转载说明
> **本文转载自：** [AULyPc 的博客](https://aulypc1.github.io/)  
> **原文作者：** [AULyPc](https://aulypc1.github.io/about/)  
> **原文标题：** 《如何在Fuwari页脚添加ICP、运行时间等信息》  
> **原文链接：** [https://aulypc1.github.io/posts/website/add_icpruntime_in_fuwari-footer/](https://aulypc1.github.io/posts/website/add_icpruntime_in_fuwari-footer/)  
> **许可协议：** 本文采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans) 许可协议，转载请注明出处。