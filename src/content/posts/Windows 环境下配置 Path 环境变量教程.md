---
title: 'Windows 环境下配置 Path 环境变量教程'
published: 2026-04-01
description: '本文介绍了多种在 Windows 中快速打开环境变量的方法，并分享了如何利用 AutoHotkey 脚本实现从 Sublime Text 一键在浏览器预览 Markdown 文档。'
image: ''  
tags: ['Windows', '环境变量', 'AutoHotkey', 'SublimeText']
category: '技术专栏'
ai: '本文由作者结合 Gemini AI 协作完成，涵盖了系统配置与自动化脚本实践。'
draft: false 
lang: 'zh-CN'
order: 0
---

# 前言

安装某个命令行软件和编程语言时，配置 Path 是 Windows 特有的流程，这里是详细的教程，以及易错点纠正。

## Step1 找到软件的安装路径[#](https://pinpe.top/posts/set-path/#step1-%E6%89%BE%E5%88%B0%E8%BD%AF%E4%BB%B6%E7%9A%84%E5%AE%89%E8%A3%85%E8%B7%AF%E5%BE%84)

配置 Path 需要具体的软件安装路径，这可能是一个文件或一个文件夹，具体路径可参照软件文档和你安装此软件的位置。

找到后，请复制路径到剪贴板备用。


## Step2 打开环境变量设置[#](https://pinpe.top/posts/set-path/#step2-%E6%89%93%E5%BC%80%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E8%AE%BE%E7%BD%AE)

在 Windows 系统中，打开“环境变量”设置的方法有很多，从最直观的图形界面到高效的命令行都有。

### 1. 最快捷的方法：运行命令（推荐）
这种方法不依赖系统版本（Win10/Win11 通用），且速度最快。
* 按下键盘上的 **`Win + R`** 键，打开“运行”对话框。
* 输入以下命令并回车：
    > `sysdm.cpl`
* 在弹出的“系统属性”窗口中，点击 **高级 (Advanced)** 选项卡，下方即可看到 **环境变量 (Environment Variables)** 按钮。

### 2. “开始”菜单搜索法
这是最符合直觉的操作方式。
* 点击任务栏的 **搜索图标** 或直接按下 **`Win`** 键。
* 输入 **“环境变量”**（英文系统输入 `env`）。
* 选择 **“编辑系统环境变量”** 或 **“编辑账户的环境变量”** 即可直接跳转。

### 3. 设置面板路径（Win10/Win11）
如果你习惯在 UI 界面中点击：
* **Win11:** 设置 -> 系统 -> 关于 -> **高级系统设置**。
* **Win10:** 设置 -> 系统 -> 关于 -> 右侧或下方的 **高级系统设置**。

### 4. 命令行一键直达（高级用户）
如果你已经打开了终端（CMD 或 PowerShell），可以直接通过命令唤起：

* **CMD:** 输入 `rundll32.exe sysdm.cpl,EditEnvironmentVariables`
* **PowerShell:** 输入 `Start-Process rundll32.exe -ArgumentList "sysdm.cpl,EditEnvironmentVariables"`

### 5. 通过控制面板（传统方式）
虽然控制面板在淡出，但依然可用：
* 打开 **控制面板** -> **系统和安全** -> **系统**。
* 点击 **高级系统设置**。

> 💡 小贴士：用户变量 vs 系统变量
>在打开的窗口中，你会看到上下两个框：
>**用户变量（上方）：** 仅对当前登录的 Windows 账号生效，安全性更高，推荐平时安装软件使用。
>**系统变量（下方）：** 对这台电脑的所有用户生效，修改需谨慎。

## Step3 找到 Path 环境变量，并添加路径[#](https://pinpe.top/posts/set-path/#step3-%E6%89%BE%E5%88%B0path%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E5%B9%B6%E6%B7%BB%E5%8A%A0%E8%B7%AF%E5%BE%84)

在系统变量里面找到名为`Path`的数组型变量，点击编辑：

![](https://pinpe.top/_astro/path.uAdDr54B_Z17h4iV.webp)

点击`新建`，粘贴第一步就复制的路径，一路确定，完成。