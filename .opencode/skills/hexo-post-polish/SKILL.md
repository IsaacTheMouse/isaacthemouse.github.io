---
name: hexo-post-polish
description: Use when polishing a Hexo post in source/_posts/ of this blog - normalizing front-matter (urlname, categories, tags, cover, excerpt) of Elog/语雀 synced posts, converting post asset images (png/jpg/jpeg/gif) to webp with ffmpeg, rewriting Yuque syntax (:::info etc.) into Hexo tags, and importing all images via {% asset_img %} with width tiers. Trigger keywords - front-matter 修改, 整理文章, 图片转 webp, webp 转换, 语雀同步后处理.
---

# Hexo 文章整理：front-matter 规范化 + 图片处理 + 语雀语法转换

对 `source/_posts/<post>.md` 及其同名资源文件夹进行整理，分为独立步骤，可按需执行。同步流程为：`elog sync -e .elog.env` 拉取到 `docs/feishu/` 后，据此整理出正式的 post。

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

## 步骤三：确定图片宽度档位并改写引用

用 ffprobe 读取每张图片的实际宽度，决定是否限制显示宽度：

```bash
for f in source/_posts/<post>/*.webp; do echo -n "$f  "; ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$f"; done
```

- 宽度 **超过 700px** 的图片：加 `img-width-70` 档位（占正文 70%）。
- 宽度 **不超过 700px** 的图片：不加宽度档位。
- 正文中**所有图片一律用 `{% asset_img %}` 标签导入**，不要使用 Markdown `![]()` 语法（图片宽度由 class 控制，见 README「响应式图片宽度」）。

`{% asset_img %}` 语法：

```
{% asset_img [class names] slug [width] [height] [title text [alt text]] %}
```

- class（如 `img-width-70`）写在文件名前。
- **alt 注意事项**：`{% asset_img %}` 的 meta 参数是 `'"标题" "替代文本"'` 双引号字符串，**第一个是 title，第二个是 alt**。主题在 `image_caption: true` 时只对带 `alt` 属性的 `<img>` 生成 `<figcaption>` 图注——因此：
  - 图片有标题时**必须同时提供 title 和 alt**，即 `{% asset_img img-width-70 x.webp '"标题" "标题"' %}`；只写一个字符串（如 `'"标题"'`）会生成 title 而缺少 alt，图注不显示。
  - 图片没有标题时省略 meta 参数，如 `{% asset_img img-width-70 x.webp %}`。

## 步骤四：语雀语法转换为 Hexo 标签

语雀同步的 Markdown 使用其专有语法，需改写为本站 Hexo/主题标签：

- `:::info` / `:::note` 等语雀容器 → `{% callout %}` 标签（成对）：
  ```
  {% callout purple fa-solid fa-circle-info %}
  内容
  {% endcallout %}
  ```
  参考站内已有 callout 用法，不要使用已弃用的 `{% note %}` / `{% notel %}`。
- 其余标准 Markdown（标题、引用 `>`、列表、链接）原样保留。

## 步骤五：多文档整合与重复同步

语雀文章可能拆分为主文档与补充文档（如「关卡设计-补」），或随内容迭代在多次同步中增删小节：

- 首次导入时，若存在与主文档强关联的补充文档（补充既有小节的内容），按逻辑顺序合并进 post 对应位置。
- **后续同步（文章已有 post）时，先用 git diff 确认语雀端更新内容**：
  ```bash
  git diff docs/feishu/     # 查看语雀端本次改动了哪些 md 文件及具体内容
  ```
  `docs/feishu/*.md` 被 git 跟踪（图片文件夹忽略），上次同步的提交即为 diff 基线。
- 再以语雀最新文档为准进行内容同步：
  - 语雀已删除的小节 → 从 post 中删除对应小节。
  - 语雀重命名/合并的小节 → 同步 post 的小节名与层级。
  - 语雀新增小节（如「后记」）→ 按顺序加入 post。
  - 语雀将未成熟内容改为概述（如将成节论述收敛为「想法太不成熟，待日后单独起稿」）→ 以语雀收敛后的写法为准，删除 post 中已展开的旧内容。
  - 同步后清理 post 资源文件夹中不再被引用的图片文件。
- 同步后 front-matter 的 `updated` 更新为语雀文档的 `updated` 值。

## 验证

```bash
grep -nE '\.(png|jpe?g|gif)' source/_posts/<post>.md        # 应无输出（或仅剩外链）
grep -nE '!\[[^\]]*\]\(' source/_posts/<post>.md             # 应无输出（正文图片必须用 asset_img）
grep -nE ':::' source/_posts/<post>.md                       # 应无输出（语雀容器必须转换）
npx hexo generate                                            # 构建无 ERROR
```

在 `public/<permalink>/index.html` 中检查 `<img src=` 均指向 `.webp`、路径正确，且带标题的图片都包在 `<figure class="image-caption"><figcaption>` 中。

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
{% asset_img xxx.webp %}
{% endcolumns %}
```

仅对拥有独立封面图（紧跟标题信息、无说明文字）的作品使用；带说明文字的内容配图保持原位。
