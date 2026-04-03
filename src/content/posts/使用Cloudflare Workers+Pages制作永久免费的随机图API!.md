---
title: 告别手动传图：利用 Bing 官方 API 打造“零维护”随机图接口
published: 2026-03-30
description: 觉得手动上传图片到 Cloudflare Pages 太麻烦？教你利用 Cloudflare Workers 实时抓取 Bing 每日壁纸，实现一个高清、自动更新且完全免费的随机图 API。
image: 'https://bing.142588.xyz'
tags: ['Cloudflare', 'API', 'Bing', '前端开发']
category: '技术专栏'
ai: '本文由 Gemini 协作完成，核心方案从手动 Pages 存储优化为 Bing 官方 API 实时转发。'
draft: false 
lang: 'zh-CN'
order: 0
---
# 原方案
转载说明：[使用Cloudflare Workers+Pages制作永久免费的随机图API! - Wudarensheng blog](https://blog.wudarensheng.top/posts/random-pages/)
## 准备工作[#](https://blog.wudarensheng.top/posts/random-pages/#%E5%87%86%E5%A4%87%E5%B7%A5%E4%BD%9C)

1.你的图片

2.一个Cloudflare账号

3.一个域名（必须托管在Cloudflare上）

## 正式开始[#](https://blog.wudarensheng.top/posts/random-pages/#%E6%AD%A3%E5%BC%8F%E5%BC%80%E5%A7%8B)

1.将你的图片\*\*（格式必须统一）\*\*放在单独的一个文件夹中，并创建一个用于批量重命名的bat脚本（**不要以管理员权限运行！！！）**，代码如下：

```
@echo off
setlocal enabledelayedexpansion

:: Check if running as administrator
net session >nul 2>&1
if !errorlevel! equ 0 (
    echo Error: This script should not be run as administrator.
    echo Please run without administrator privileges.
    pause
    exit /b 1
)

set "script_name=%~nx0"
set /a counter=1

echo Renaming files...
echo.

:: First, create a temporary directory to avoid naming conflicts
set "temp_dir=temp_rename_%random%"
mkdir "%temp_dir%"

:: Move all files (except script) to temp directory first
for %%f in (*) do (
    if /i not "%%f"=="%script_name%" (
        if not "%%f"=="%temp_dir%" (
            move "%%f" "%temp_dir%\%%f" >nul
        )
    )
)

:: Rename files from temp directory back with new names
for %%f in ("%temp_dir%\*") do (
    set "filename=%%~nxf"
    set "ext=%%~xf"
    if "!ext!"=="" set "ext="
    set "new_name=!counter!!ext!"

    move "%%f" "!new_name!" >nul
    if !errorlevel! equ 0 (
        echo Renamed: "!filename!" --^> "!new_name!"
        set /a counter+=1
    ) else (
        echo Error: Cannot rename "!filename!"
    )
)

:: Remove temporary directory
rmdir "%temp_dir%" /s /q >nul 2>&1

echo.
echo Operation completed. Total files processed: %counter%
pause
```

保存脚本并运行，就完成了图片的重命名。接着将你的图片添加到压缩包。

2.登录Cloudflare账号，找到侧边栏的Worker，创建一个pages，选择“上传资产”。将压缩包上传，点击部署，复制类似 {你的pages名称}.pages.dev的域名，备用。

3.再创建一个worker，选择从helloworld开始，名称随意。部署完成后选择右上角编辑代码，将里面的内容删完，接着粘贴以下代码：

```
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const randomNumber = Math.floor(Math.random() * 9) + 1;  //9改为实际的图片数量
  const imageUrl = `https://wdrs-page.pages.dev/${randomNumber}.png`;  //png改为实际的图片格式

  try {
    const response = await fetch(imageUrl);
    if (response.ok) {
      return new Response(response.body, {
        headers: { 'Content-Type': 'image/png' }  //这里一样的，改为实际的图片格式
      });
    }
    return new Response('Image not found', { status: 404 });
  } catch (error) {
    return new Response('Service unavailable', { status: 503 });
  }
}
```

按照代码右边的注释改完后，点击部署

4.给worker绑定一个自定义域名，地址栏输入分配的域名就可以访问了！

# 简单方案（**使用 Bing 官方 API**）

   这种方法你不需要上传图片，不需要 GitHub 仓库，甚至不需要每天更新，因为 Bing 会帮你更新。
## 获取当日图片

在你的 Workers 编辑器中，直接替换为以下代码：

```
async function handleRequest(request) {
  const BING_API = "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1";

  try {
    // 1. 请求 Bing 官方接口获取图片数据
    const response = await fetch(BING_API);
    const data = await response.json();

    // 2. 提取图片路径并拼接完整 URL
    // data.images[0].url 通常是 /th?id=OHR.XXX.jpg
    const imgRelativePath = data.images[0].url;
    const fullImgUrl = `https://www.bing.com${imgRelativePath}`;

    // 3. 策略选择：
    // 方案 A: 直接 302 重定向到 Bing 图片（速度快，节省 Workers 资源）
    return Response.redirect(fullImgUrl, 302);

    /* // 方案 B: 代理读取图片并输出（隐藏真实地址，看起来更像本地 API）
    const imageResponse = await fetch(fullImgUrl);
    return new Response(imageResponse.body, {
      headers: { 'Content-Type': 'image/jpeg' }
    });
    */

  } catch (e) {
    return new Response("抓取 Bing 图片失败", { status: 500 });
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
```
## 随机获取最近的 8 张 图片

在你的 Workers 编辑器中，直接替换为以下代码：

```
async function handleRequest(request) {
  // 1. 生成随机索引：0 代表今天，1-7 代表过去 7 天
  const randomIndex = Math.floor(Math.random() * 8);
  
  // 2. 构造 Bing 官方接口 URL (n=8 表示获取最近 8 张的数据)
  const BING_API = `https://www.bing.com/HPImageArchive.aspx?format=js&idx=${randomIndex}&n=1`;

  try {
    // 3. 抓取 Bing 接口数据
    const response = await fetch(BING_API);
    const data = await response.json();
    
    // 4. 提取图片路径
    if (data.images && data.images.length > 0) {
      const imgRelativePath = data.images[0].url;
      const fullImgUrl = `https://www.bing.com${imgRelativePath}`;

      // 5. 302 重定向到真实的图片地址
      return Response.redirect(fullImgUrl, 302);
    } else {
      throw new Error("Invalid Bing API response");
    }

  } catch (error) {
    return new Response("抓取随机 Bing 图片失败: " + error.message, { status: 500 });
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
```
# 方案对比
| 维度         | 旧方案 (手动 Pages 存储)               | 新方案 (Bing 官方 API)                          |
| ------------ | -------------------------------------- | ----------------------------------------------- |
| 图片来源     | 需自行搜集、重命名、打包               | 官方源：自动获取 Bing 每日壁纸                  |
| 维护成本     | 高：增加新图需重新上传部署             | 零维护：自动同步，永久更新                     |
| 存储压力     | 占用 Cloudflare Pages 配额             | 不占空间：仅做请求中转与重定向                 |
| 加载速度     | 取决于 Pages 节点的全球分发            | 极速：利用微软官方 CDN 节点加速                |
| 图片质量     | 取决于本地素材质量                     | 高清原图：固定提供 1080P/4K 图像               |
| 实现难度     | 涉及脚本运行、压缩、多步部署           | 极简：一行 Workers 代码即可搞定                |
