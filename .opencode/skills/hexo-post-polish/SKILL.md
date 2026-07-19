---
name: hexo-post-polish
description: Use when polishing a Hexo post in source/_posts/ of this blog - normalizing front-matter (urlname, categories, tags, cover, excerpt) of Elog/语雀 synced posts, and converting post asset images (png/jpg/jpeg/gif) to webp with ffmpeg while updating Markdown references. Trigger keywords - front-matter 修改, 整理文章, 图片转 webp, webp 转换, 语雀同步后处理.
---

# Hexo 文章整理：front-matter 规范化 + 图片 webp 转换

对 `source/_posts/<post>.md` 及其同名资源文件夹进行整理，分为两个独立步骤，可按需执行。

## 步骤一：规范化 front-matter

参考站内已有文章（如 `wake-up-review.md`、`building-a-website-for-lightline-igdc.md`）的格式：

```yaml
---
title: 文章标题
urlname: readable-slug
date: '2026-01-01 00:00:00'
updated: '2026-01-01 00:00:00'
categories:
  - 分类名
tags: 
  - "标签名"
cover: 'xxxx.webp'
excerpt: '一句话摘要'
---
```

修改要点：

- `urlname`：语雀同步生成的随机串（如 `khkqyq8overfv48p`）改为可读的英文 slug。
- `date` / `updated`：保留原值不动。
- `categories` / `tags`：根据文章内容补充；参考已有文章的分类体系（游戏、技术、站务等）。
- `cover`：改为文章资源文件夹内的本地图片文件名（纯文件名，无路径前缀），不要使用语雀 CDN 外链；若已转换 webp 则使用 `.webp` 后缀。
- `excerpt`：Elog 生成的 `description`（正文开头堆砌的长文本）删除，替换为一句话手写摘要，键名用 `excerpt`。

## 步骤二：图片转换为 webp

本机只有 `ffmpeg` 可用（无 cwebp/magick）。在文章资源文件夹 `source/_posts/<post>/` 中执行：

```bash
for f in *.png *.jpg *.jpeg; do [ -e "$f" ] || continue; ffmpeg -y -loglevel error -i "$f" -c:v libwebp -quality 90 "${f%.*}.webp"; done
for f in *.gif; do [ -e "$f" ] || continue; ffmpeg -y -loglevel error -i "$f" -c:v libwebp_anim -loop 0 -quality 85 "${f%.*}.webp"; done
```

- 静态图用 `libwebp`，GIF 动图用 `libwebp_anim` 并加 `-loop 0` 保留循环动画。
- 确认所有 `.webp` 生成成功后，删除原始图片文件。

然后更新 md 中的引用（含正文 `![]()` 和 front-matter 的 `cover`）：

```bash
sed -i -E 's/\]\(([^)]+)\.(png|jpe?g|gif)\)/](\1.webp)/g' source/_posts/<post>.md
```

## 验证

```bash
grep -nE '\.(png|jpe?g|gif)' source/_posts/<post>.md   # 应无输出（或仅剩外链）
npx hexo generate                                       # 构建无 ERROR
```

在 `public/<permalink>/index.html` 中检查 `<img src=` 均指向 `.webp` 且路径正确。

## 可选：columns 分栏布局

作品展示类文章可用站点自定义标签 `{% columns %}`（实现见 `scripts/columns.js`）将「作品介绍 + 封面图」排成 50-50 两栏：

```markdown
{% columns gap=24 %}
<!-- column -->
## 作品名
时间：...  
职能：...  
引擎：...
<!-- column -->
![](cover.webp)
{% endcolumns %}
```

仅对拥有独立封面图（紧跟标题信息、无说明文字）的作品使用；带说明文字的内容配图保持原位。
