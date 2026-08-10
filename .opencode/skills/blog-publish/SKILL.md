---
name: blog-publish
description: Use when publishing the blog - pre-publish checklist (git status, image optimization, feature update log), commit, summarize for user review, and deploy. Trigger keywords - 发布, 部署, deploy, publish, 推送.
---

# 博客发布流程

## 触发条件

用户要求发布/部署博客时执行此流程。流程结束于用户确认是否执行远程部署。

## 发布边界

使用 git 轻量标签 `published` 标记每次发布的 commit。首次发布前该标签不存在，此时以 `git log --oneline` 最近一条影响站点功能的 commit 为参考点。

## 步骤

### 1. 检查 git 状态

```bash
git status
git log --oneline -10
```

### 2. 检查新增文章的图片格式

对 `git status` 中新增或变更的文章（`source/_posts/` 下），检查其资源文件夹中是否有未优化的图片：

```bash
find source/_posts/ -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.gif" \)
```

若有非 webp 图片，加载 `hexo-post-polish` skill，按其中步骤二执行 webp 转换，同步更新 Markdown 引用。若全部已是 webp，跳过此步。

### 3. 检查功能更新日志

读取 `source/_posts/hello-world.md`，找到「功能更新日志」节中最新的日期条目。

确定"上次发布"以来的待检查 commits：

```bash
# 方式一：使用 published 标签
git log published..HEAD --oneline

# 方式二（published 标签不存在时）：以 hello-world.md 最新日志条目日期为基准
# 人工/对话中确认上次发布的 commit
git log --oneline --since="<最新日志日期>"
```

对上述范围内的每个 commit，按以下两步问答判定是否记入：

**判定标准：更新日志是写给博客读者看的。只要变更部署后会改变读者在站点上可见的内容（外观/结构/行为/功能），就应记入；唯一豁免是「文章正文增删改」——读者能通过文章列表自行发现。**

1. **该变更是否部署到站点并改变读者可见的内容？**
   - 否 → 不记入（本地工具链、依赖升级、开发文档等）
   - 是 → 继续第 2 步
2. **是否只是文章正文内容的增删改？**
   - 是 → 不记入（读者可从文章列表自行发现）
   - 否 → **记入**

| 记入（读者可见的站点级变更） | 不记入 |
| --- | --- |
| 新增页面（如 `/portfolio/`） | 新增/修改/删除文章 |
| 站点外观资源：站点图标、Logo、首页 Banner/背景图等 | 本地工具链调整（elog 配置、bat 脚本、编辑器配置） |
| 页面内容组织/展示变更（作品集展示顺序等） | 依赖升级 |
| 新增/修改主题功能或交互（评论、标签、分栏、弹窗等） | 文档更新（README、AGENTS） |
| 站点级自定义标签/脚本（`{% columns %}`、图片宽度档位等） | 纯内部重构（读者可见效果不变，且未修复读者可见问题） |
| 修复读者可见问题的实现变更（如部署后数据不刷新） | |

**注意：** 视觉/外观类变更**不豁免**——只要读者在站点上能看到，就要记入。这与 AGENTS.md「文档同步」表中"主题外观、配色等纯视觉调整"无需同步文档（面向维护者）的规则相互独立，判定更新日志时不可混用。

若有遗漏的功能更新，补充到 `hello-world.md` 的功能更新日志中，日期使用当前日期，格式对齐已有条目：

```markdown
- YYYY/MM/DD
  - 功能描述，可含链接。
```

### 4. 提交本地修改

```bash
git add <相关文件>
git commit -m "<遵照 Conventional Commits 规范的中文提交信息>"
```

提交信息需遵循 AGENTS.md 中的提交规范（Conventional Commits + 中文）。

### 5. 输出发布摘要

向用户输出以下信息并等待确认：

- **新增文章**：列出本次新增的 `.md` 文件
- **博客功能更新**：引用本次写入 hello-world.md 的原文
- **图片检查结果**：未发现问题 / 已转换 N 张图片
- **待发布 commit**：`git log --oneline <上次发布tag>..HEAD`

### 6. 远程部署

> 仅当用户确认发布后执行此步。

本项目的部署工具是根目录下的 `blog-tool.bat`，选择选项 `[3] 远程部署`。在 bash 中可直接执行等价命令：

```bash
npx hexo clean && npx hexo deploy
```

确认部署成功后，更新 `published` 标签：

```bash
git tag -f published
```

## 注意事项

- 仅将**部署后读者可见**的站点级变更写入功能更新日志；本地工具链（elog 配置、bat 脚本、编辑器配置等）不记入。判定标准见第 3 节的两步问答。
- 图片优化委托给 `hexo-post-polish` skill，不在此 skill 中重复图片转换命令。
- 发布边界依赖 `published` 标签，若标签不存在则需与用户确认上次发布的 commit。
- 摘要输出必须引用功能更新日志的原文，而非转述。

## 参考资料

- [AGENTS.md](./AGENTS.md) — 提交规范、文档同步约定
- [hexo-post-polish skill](../hexo-post-polish/SKILL.md) — 图片 webp 转换
