---
title: 社团主页搭建
urlname: website-for-lightline-igdc
date: '2025-11-26 17:54:35'
updated: '2025-12-10 21:10:28'
categories:
  - 技术
  - 运维
tags: 
  - "Blog"
cover: '42eb9bbcc5e1116bca51f40630c059d1.webp'
excerpt: '在建完个人博客后发现 Hexo 建站真是太快啦！所以，今天花了点时间给社团主页也搞了一下，记录一下搭建过程，当作 git 操作的练手。'
---
在建完个人博客后发现 Hexo 建站真是太快啦！所以，今天花了点时间给社团主页也搞了一下，记录一下搭建过程，当作 git 操作的练手。

{% callout purple fa-solid fa-tools::环境 %}
Node.js: v24.11.1  
Hexo: v8.1.1  
hexo-theme-redifine: v2.8.5
{% endcallout %}

## 博客配置
### Hexo 及主题初始化
第一步当然是新建文件夹。

```powershell
hexo init <folder>
cd <folder>
npm install
```

安装主题。

```powershell
npm install hexo-theme-redefine@latest
```

在 Hexo 根目录的`_config.yml`文件中，将`theme`值修改为`redefine`。

在 Hexo 根目录下创建`_config.redefine.yml`文件，将[主题提供的配置](https://github.com/EvanNotFound/hexo-theme-redefine/blob/main/_config.yml)导入进文件中。

### 主页
通过编辑`_config.redefine.yml`文件，可以修改主页的配置信息。

```yaml
# BASIC INFORMATION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# Docs: https://redefine-docs.ohevan.com/basic/info
info:
  # Site title
  title: 光线独游社
  # Site subtitle
  subtitle: 一群热爱游戏开发的人！
  # Author name
  author: 光线独立游戏制作社
  # Site URL
  url: https://lightline-igdc.github.io
# BASIC INFORMATION <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end

# HOME BANNER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
# Docs: https://redefine-docs.ohevan.com/home/home_banner
home_banner:
  # Whether to enable home banner
  enable: true
  # style of home banner
  style: static # static or fixed
  # Home banner image
  image: 
    light: /images/lightline-bg-light.png # light mode
    dark: /images/lightline-bg-dark.png # dark mode
  # Home banner title
  title: 欢迎来到光线独游社！
  # Color of home banner text
  text_color: 
    light: "#221815" # light mode
    dark: "#221815" # dark mode
    social_links:
    # Whether to enable
    enable: true
    # Social links style
    style: default # default, reverse, center
    # Social links
    links:
      github: https://github.com/LightLine-IGDC # your GitHub URL
      email: LightLineIGDC@163.com # your email
```

为主页添加了背景图片，通过调整 logo 在实际图片中的位置，配合 static 类型的主页图片样式，可以实现如图的主页效果。分别制作了两张不同风格的背景图片以适应黑夜模式 / 明亮模式。

![黑夜模式的主页效果图](42eb9bbcc5e1116bca51f40630c059d1.webp)

![明亮模式下的主页效果图](768677ce7f8507449b25c388b08008fc.webp)

### 常用链接页
按 [Redefine 文档](https://redefine-docs.ohevan.com/zh/page_templates/bookmarks)描述，首先创建一个新页面，在这里我并没有更改页面的名字（对应 url 中的路径）。

```powershell
hexo new page bookmarks
```

然后，打开这个页面的 Markdown 文件（`source/bookmarks/index.md`），编辑 Front Matter，添加 `template: bookmarks`。

```markdown
---
title: 常用链接
date: 2025-12-02 15:30:27
template: bookmarks
---
```

接着创建书签存放文件，在`source`文件夹里增加`_data`文件夹，新建一个`bookmarks.yml`文件，然后在该文件内按格式配置书签信息。

```yaml
- category: 免费资产
  icon: fa-icons # 分类的图标，使用 FontAwesome 图标
  items:
    - name: Kenny 的免费游戏资产 # 网站名称
      link: https://kenney.nl/ # 网站链接
      description: 大量免费2D和3D游戏美术素材包 # 介绍
      image: https://kenney.nl/favicon.ico # 图标
    - name: Kevin MacLeod 的无版权音乐
      link: https://incompetech.com/music/royalty-free/music.html
      description: 可按流派及情绪进行搜索
      image: https://incompetech.com/favicon.ico
```

在这个过程中，发现大部分网站 favicon 格式固定，均为`网址/favicon.ico`形式，但仍有部分网站未提供或存在访问问题，固改为使用本地文件方式。

将图标文件存放至`source/images/`下，使用时通过相对路径进行调用：

```yaml
- category: GameJam 官网
  icon: fa-earth-asia
  items:
    - name: 爱满星空 公益Game Jam
      link: https://www.gmhub.com/jams/gamecarejam2025
      description: 以社会化的内容作为主题开展的极限开发活动
      image: /images/gcj-icon.png
```

![实现效果](93e1c418715bbb6e22279e219bc73f7b.webp)

### 相册
在这个部分首先需要考虑两个问题：大量图片的访问是否会带来过高的开销？图片的访问性如何保证？

这在图片偏少的其他页面或许不是一个大问题，大可以将所有图片全部堆在 repository 中，但相册的图片数量可能会在长期维护中逐渐增长，直到对网络甚至设备带来较大的开销。同时国内网络对 GitHub 用户内容的访问性不佳也时刻需要考虑的问题。

可以从两个方面尝试解决：压缩图片体积以及优化图片的存储访问方式。

#### 压缩图片体积
说到网络访问图片的压缩，第一时间想到的肯定是 [WebP](https://developers.google.com/speed/webp?hl=zh-cn) 吧，这是一种谷歌开发的适用于网络的图片格式，可以实现品质卓越的无损和有损压缩，常用于博客和网络漫画等。

> WebP 无损图片比 PNG 图片小 [26%](https://developers.google.com/speed/webp/docs/webp_lossless_alpha_study?hl=zh-cn#results)。WebP 有损图片比采用等效 [SSIM](https://en.wikipedia.org/wiki/Structural_similarity) 质量指标的同等 JPEG 图片[缩小 25-34%](https://developers.google.com/speed/webp/docs/webp_study?hl=zh-cn)。
>

考虑到网站面对的使用环境（现代浏览器）对 WebP 不存在兼容性问题，可以使用将大部分图片都转为 WebP 的方式来降低开销。对于可能存在的特定需求（如用户需要高清活动照片用于收藏），可以混合使用其他存储方式，或是提供源文件的归档链接。

同时 Redefine 主题提供了[使用 hexo-all-minifier 插件打包压缩文件](https://redefine-docs.ohevan.com/zh/plugins/all_minifier)的方式来减少网站的加载时间，使用该方法可以有效加速包括图片在内的大部分静态内容的访问。

#### 存储访问方式
下表列出了部分可行性较高的存储方式：

| 存储方式 | 费用 | 备注 |
| --- | --- | --- |
| SM.MS 等公共图床 | 无 | 存在访问不稳定、跑路等风险 |
| 轻量云自建图床 | ~无 | 存在带宽问题 |
| GitHub | 无 | 可能存在部分网络环境访问困难 |
| [Cloudflare 对象存储 R2](https://www.cloudflare.com/zh-cn/lp/pg-r2-comparison-2/) | 10 GB/月 内免费 | 类似的按量免费的存储服务有不少 |
| [腾讯云 对象存储 COS](https://cloud.tencent.com/product/cos) | 0.1元/GB/月 起 | 流量额外收费 |


可以看到有很多低价格甚至免费的选项，最优的选择应该是白嫖 Cloudflare。

访问方面，Redefine 提供了[使用 CDN 加速访问](https://redefine-docs.ohevan.com/zh/cdn)的功能，可以选择使用作者自费提供的 CDN 或是自行接入。

考虑到目前图片量不多，我自行测试时访问速度尚可，且完整配置该部分需要折腾较长时间，我的选择是先使用 GitHub 存储，不配置 CDN，待完整部署后观察反馈再进行调整。

#### 上传工具
因需要上传的图片数量很多，同时还需要在上传前修改格式，规范图片的命名，一个图片上传工具就显得很有必要。在搜索后找到了一个工具 [PicList](https://piclist.cn) 可以解决以上问题。它提供了上传前对图片进行压缩、转换格式、按规则重命名的功能，支持切换多个配置文件，可以使用快捷键快速上传剪切板中的文件。

## GitHub 及 Git 操作
### GitHub Organization
搞了半天注册不下来谷歌邮箱，改用163注册了公共邮箱`LightLineIGDC@163.com`，然后使用该邮箱创建了 [GitHub 组织](https://github.com/LightLine-IGDC)。

新建了一个用户组 BlogDev 用于权限管理，该用户组拥有 repository 的 admin 权限。

### Git commit message
在进行提交的过程中发现，根据传统格式进行 commit message 的编写时，会出现一些难以界定的情况。比如，我为一个书签页面添加了新的链接，它并没有更新任何代码逻辑，但又属于重要的内容更新，那么这应该是feat还是style还是doc呢？

询问了 ChatGPT，给我的回复是常用约定为内容更新如发布新文章等会使用 feat，考虑到 commit message 结构中有 Scope 这一项，决定在之后涉及特定页面的内容更新都使用 `feat(<scope>): <summary>` 的格式。

![符合该格式的一次提交](398396c0b65e884b3cd155f7def5e111.webp)

### GitHub Pages 部署
根据之前搭建个人博客的操作，在组织下新建了 [repository](https://github.com/LightLine-IGDC/lightline-igdc.github.io)，命名为 lightline-igdc.github.io。

因多人协同需要上传源文件夹，故使用[通过 GitHub Actions 部署 GitHub Pages](https://hexo.io/zh-cn/docs/github-pages.html) 的方式进行部署。

具体步骤为：

1. 前往 repository 的 **Settings > Pages > Source**，将 source 更改为`GitHub Actions`
2. 在`.github/workflows/`下新建`pages.yml`，填入自动化配置并修改参数
3. 在本地进行修改后，commit 到本地项目的 main 分支
4. Push origin 并等待 GitHub Actions Build & Deploy 完成

此后，每次云端项目的 main 分支有新的变更，GitHub Actions 会自动构建并部署新的网站。

#### 遇到了问题！
在部署到云端后检查时发现，部分本地化内容没有同步，这是因为我在修改这部分内容时，是通过直接修改对应的主题文件（node.js package 中的文件）实现的，这在前文的 GitHub Actions 部署流程中是不可行的，因为 GitHub Actions 在部署时是直接使用 npm 从互联网拉取 package 文件。

改为使用本地构建的[一键部署](https://hexo.io/zh-cn/docs/one-command-deployment)模式或许可以解决该问题，但鉴于该项目已经花费较多时间，我决定先行搁置该项目，之后再进行修改。

## 后记
前前后后花了两周时间才完成全部内容，没想到这B玩意花了我这么长时间……

总之是把社团网站成功跑起来了，虽然是用博客改的，但需要的效果都实现了，而且看起来效果不错，就不计较那么多了。接下来要干的无非是把维护的各种规范写一写，然后解决一下前文提到的两个问题，这些就交给未来的我吧~

