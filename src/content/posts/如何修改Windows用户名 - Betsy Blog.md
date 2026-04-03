---
title: 如何彻底修改 Windows 用户文件夹名（中文改英文）
published: 2026-03-30
description: 本教程详细介绍了通过启用超级管理员账户、修改注册表 ProfileImagePath 及手动重命名用户文件夹，解决 Windows 用户名包含中文导致软件运行异常的方法。
image: ''
tags: ['Windows 10/11', '系统优化', '注册表修改', '技术指南']
category: '技术专栏'
ai: '本文详细介绍了如何彻底修改 Windows 用户文件夹名（即将 C:\Users\用户名 中的中文名改为英文名）。这在解决某些软件或游戏因不支持中文路径而报错时非常有用。'
draft: false 
lang: 'zh-CN'
order: 0
---

### 1.首先你需要打开你的命令提示符（管理员权限），然后输入以下命令来开启超级用户去修改你的用户名：[#](https://www.micostar.cc/posts/userz-e/#1%E9%A6%96%E5%85%88%E4%BD%A0%E9%9C%80%E8%A6%81%E6%89%93%E5%BC%80%E4%BD%A0%E7%9A%84%E5%91%BD%E4%BB%A4%E6%8F%90%E7%A4%BA%E7%AC%A6%E7%AE%A1%E7%90%86%E5%91%98%E6%9D%83%E9%99%90%E7%84%B6%E5%90%8E%E8%BE%93%E5%85%A5%E4%BB%A5%E4%B8%8B%E5%91%BD%E4%BB%A4%E6%9D%A5%E5%BC%80%E5%90%AF%E8%B6%85%E7%BA%A7%E7%94%A8%E6%88%B7%E5%8E%BB%E4%BF%AE%E6%94%B9%E4%BD%A0%E7%9A%84%E7%94%A8%E6%88%B7%E5%90%8D)

![打开管理员命令提示符](https://www.micostar.cc/images/ML.webp)

Terminal window

```bash
1net user administrator /active:yes
```

### 2.然后按下Alt+F4，选择切换用户，切换到管理员账户（Administrator）[#](https://www.micostar.cc/posts/userz-e/#2%E7%84%B6%E5%90%8E%E6%8C%89%E4%B8%8Baltf4%E9%80%89%E6%8B%A9%E5%88%87%E6%8D%A2%E7%94%A8%E6%88%B7%E5%88%87%E6%8D%A2%E5%88%B0%E7%AE%A1%E7%90%86%E5%91%98%E8%B4%A6%E6%88%B7administrator)

### 3.在任务管理器（Ctrl+Shift+Esc）关闭之前的用户所有进程[#](https://www.micostar.cc/posts/userz-e/#3%E5%9C%A8%E4%BB%BB%E5%8A%A1%E7%AE%A1%E7%90%86%E5%99%A8ctrlshiftesc%E5%85%B3%E9%97%AD%E4%B9%8B%E5%89%8D%E7%9A%84%E7%94%A8%E6%88%B7%E6%89%80%E6%9C%89%E8%BF%9B%E7%A8%8B)

![任务管理器关闭用户进程](https://www.micostar.cc/images/UserM.webp)

### 4.先重命名用户文件夹（C:\\Users\\原中文用户名）为（C:\\Users\\新英文用户名）[#](https://www.micostar.cc/posts/userz-e/#4%E5%85%88%E9%87%8D%E5%91%BD%E5%90%8D%E7%94%A8%E6%88%B7%E6%96%87%E4%BB%B6%E5%A4%B9cusers%E5%8E%9F%E4%B8%AD%E6%96%87%E7%94%A8%E6%88%B7%E5%90%8D%E4%B8%BAcusers%E6%96%B0%E8%8B%B1%E6%96%87%E7%94%A8%E6%88%B7%E5%90%8D)

![用户文件夹重命名](https://www.micostar.cc/images/Users.webp)

如果存在仍有进程在运行问题，则开启你的资源监视器（Ctrl+Shift+Esc下的性能页面右上角的“打开资源监视器”） ![资源监视器](https://www.micostar.cc/images/ZYGL.webp)

然后在资源监视器的CPU页面的关联句柄搜索框中输入你的用户名，找到相关进程并结束它们（需要重启则重启，后续仍选择超级管理员，误进入原来的用户导致错乱后果自负！！！） ![资源监视器搜索关联句柄](https://www.micostar.cc/images/ZYJ.webp)

### 5.然后打开注册表编辑器（Win+R，输入regedit回车），定位到以下路径：[#](https://www.micostar.cc/posts/userz-e/#5%E7%84%B6%E5%90%8E%E6%89%93%E5%BC%80%E6%B3%A8%E5%86%8C%E8%A1%A8%E7%BC%96%E8%BE%91%E5%99%A8winr%E8%BE%93%E5%85%A5regedit%E5%9B%9E%E8%BD%A6%E5%AE%9A%E4%BD%8D%E5%88%B0%E4%BB%A5%E4%B8%8B%E8%B7%AF%E5%BE%84)

```
1HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList\S-1-5-21-1144158939-3632170427-3967875196-1001（一般是第三个，选中有你用户名的即可）
```

修改<ins><strong>ProfileImagePath</strong></ins> ![修改注册表ProfileImagePath](https://www.micostar.cc/images/eng11.webp)

### 6.更改完成注册表后，按下Alt+F4，选择切换用户，切换到你的新英文用户名即可[#](https://www.micostar.cc/posts/userz-e/#6%E6%9B%B4%E6%94%B9%E5%AE%8C%E6%88%90%E6%B3%A8%E5%86%8C%E8%A1%A8%E5%90%8E%E6%8C%89%E4%B8%8Baltf4%E9%80%89%E6%8B%A9%E5%88%87%E6%8D%A2%E7%94%A8%E6%88%B7%E5%88%87%E6%8D%A2%E5%88%B0%E4%BD%A0%E7%9A%84%E6%96%B0%E8%8B%B1%E6%96%87%E7%94%A8%E6%88%B7%E5%90%8D%E5%8D%B3%E5%8F%AF)

然后打开任务管理器（Ctrl+Shift+Esc）关闭管理员账户所有进程；再打开命令提示符（管理员权限），然后输入以下命令来关闭超级用户：

Terminal window

```bash
1net user administrator /active:no
```

### 7.配置文件看的是你C盘根目录下的Users文件夹下的用户名文件夹，并非是设置里的用户名[#](https://www.micostar.cc/posts/userz-e/#7%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E7%9C%8B%E7%9A%84%E6%98%AF%E4%BD%A0c%E7%9B%98%E6%A0%B9%E7%9B%AE%E5%BD%95%E4%B8%8B%E7%9A%84users%E6%96%87%E4%BB%B6%E5%A4%B9%E4%B8%8B%E7%9A%84%E7%94%A8%E6%88%B7%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9%E5%B9%B6%E9%9D%9E%E6%98%AF%E8%AE%BE%E7%BD%AE%E9%87%8C%E7%9A%84%E7%94%A8%E6%88%B7%E5%90%8D)