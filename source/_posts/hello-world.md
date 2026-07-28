---
title: 博客重构
date: '2025-11-21 17:56:49'
updated: '2025-11-24 21:10:28'
categories:
  - 站务
tags: 
  - "Blog"
excerpt: '使用 [Hexo](https://hexo.io/) 重构了个人博客，同时本文作为博客的更新日志。'
---
使用 [Hexo](https://hexo.io/) 重构了个人博客，以前的文章有点太老了，看看有哪些能重写的，慢慢更新。

### 功能更新日志
- 2025/11/23
  - 重构了博客，使用主题 [Redefine v2.8.5](https://github.com/EvanNotFound/hexo-theme-redefine)。
  - 添加了[友情链接](/links/)。
- 2025/11/24
  - 添加了[标签](https://redefine-docs.ohevan.com/zh/page_templates/tags)。
- 2026/07/09
  - 实现了[基于 Waline 的评论系统](https://redefine-docs.ohevan.com/zh/docs/posts/comment#waline-%E9%85%8D%E7%BD%AE)。
  - 修改了[图片的嵌入方式](https://hexo.io/zh-cn/docs/asset-folders)，（希望能够）用来绕过429。
- 2026/07/20
  - 添加了[自定义 `{% columns %}` 分栏标签](https://github.com/EvanNotFound/hexo-theme-redefine/issues/322)，支持图文左右分栏布局、移动端自动堆叠。
- 2026/07/28
  - 新增[个人作品展示](/portfolio/)页面，以卡片与弹窗形式展示历年 GameJam 和个人项目。
