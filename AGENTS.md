# AGENTS.md

AI 编码助手在本项目的开发与维护指南。关于项目背景、结构、本地开发、部署和配置的详细介绍，请参阅 [README.md](./README.md)。

## 快速上手

- **安装依赖：** `npm install`
- **本地预览：** `npx hexo server`
- **构建产物：** `npx hexo generate`
- **清除缓存：** `npx hexo clean`
- **一键部署：** `npx hexo clean && npx hexo deploy`

以上命令的详细说明见 README.md 的「本地开发」和「远程部署」章节。

## 项目技术栈

| 项目 | 版本/说明 |
| --- | --- |
| Hexo | 8.1.1 |
| 主题 | hexo-theme-redefine 2.9.0（通过 npm 安装，不在 `themes/` 目录下） |
| 语言 | zh-CN，文章为中英混合 |
| 包管理器 | 项目同时存在 `package-lock.json` 和 `yarn.lock`，优先使用 npm |
| Node.js | 项目未锁定版本，使用当前 LTS |

## 关键文件与职责

修改以下文件前应先阅读 README.md 对应章节：

| 文件 | 职责 | 参考 |
| --- | --- | --- |
| `_config.yml` | Hexo 主配置（站点信息、部署目标、生成选项） | README「Hexo 与主题配置」及「远程部署」 |
| `_config.redefine.yml` | Redefine 主题配置（外观、评论、插件等，文件较长，编辑时使用精确匹配） | README「Hexo 与主题配置」 |
| `elog.config.js` | Elog 多平台同步配置（读写来源、输出目录、图片处理） | README「Elog 语雀同步」 |
| `elog.image-path-ext.js` | Elog 图片路径拓展点，按文档标题分文件夹存放，Markdown 输出纯文件名引用 | README「Elog 语雀同步」 |
| `source/_posts/` | Hexo 文章发布目录，含各文章的资源文件夹 | README「内容维护」 |
| `source/images/` | 全局图片，构建后映射到 `/images/` | README「图片存储与访问」 |
| `source/_data/links.yml` | 友链页数据 | README「内容维护」 |
| `source/_data/portfolio.yml` | 作品集结构化数据，含筛选元数据、Markdown 正文和相关链接 | README「内容维护」 |
| `source/portfolio/` | `/portfolio/` 独立页面入口及作品集专属图片 | README「内容维护」 |
| `scripts/columns.js` | 站点级自定义标签 `{% columns %}`，分栏布局（参数 `ratio`/`cols`/`gap`/`fill`，`<!-- column -->` 分隔，各栏顶对齐，移动端自动堆叠） | README「写作指导」 |
| `scripts/article-images.js`、`source/css/article-images.css` | 正文图片的响应式宽度档位（50%/70%/90%，移动端 100%） | README「写作指导」 |
| `scripts/portfolio.js` | 通过 `template_locals` 在页面模板阶段生成作品卡片、详情弹窗和主题按钮 | README「内容维护」 |
| `source/css/portfolio.css`、`source/js/portfolio.js` | 作品集页面样式与兼容 Swup 的弹窗交互 | README「内容维护」 |
| `scaffolds/` | `hexo new` 命令使用的文章模板（draft/page/post） | Hexo 文档 |
| `.elog.env` | Elog 凭据文件，已被 gitignore，禁止提交 | README「安全注意」 |

## 修改代码的约定

- **不要添加注释**，除非用户明确要求。
- 遵循项目已有的代码风格（YAML 缩进为 2 空格，JS 使用单引号）。
- 修改 YAML 配置时保持与现有格式一致。
- 修改 `_config.redefine.yml` 时注意该文件较长，使用精确匹配进行编辑。

## 文档同步

进行任何特性更新的 commit 前，必须先判断该修改是否需要同步到 `README.md` 和 `AGENTS.md`，若需要则必须将变更内容同步进去。

**判断标准如下：**

| 需要同步 | 无需同步 |
| --- | --- |
| 影响项目开发/维护的工作流变更（如构建流程、部署方式、同步命令、图片处理逻辑） | 纯内容更新（新增/修改/删除文章、友链、标签、书签等） |
| 配置文件的关键选项变更（如 `_config.yml`、`_config.redefine.yml`、`elog.config.js` 中影响构建或部署行为的字段） | 格式/样式微调（如 Markdown 排版、YAML 缩进等不影响机器读取的格式调整） |
| 新增/移除/更换工具或依赖，影响本地开发环境搭建 | 文章内图片的新增/替换 |
| 文件结构或命名约定的变化 | 错别字、措辞等文章内容修正 |
| 安全策略变化（如凭据管理方式） | 主题外观、配色等纯视觉调整 |

简言之：**影响未来 blog 维护流程的变更需同步；仅影响站点的内容展示的变更无需同步。**

## 提交规范

提交前，检查是否已经进行了上一节提到的文档同步。

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/)。使用中文编写提交消息。

凡是涉及特定页面的内容更新都使用 `feat(<pagename>): <summary>` 的格式，例如：

```text
✨ feat(bookmarks): 新建5个分类，添加部分网站链接
- 新建了5个分类：免费资产、游戏引擎、GameJam 官网、竞赛官网、行业资料
- 为各个分类添加了少量网站
- 为访问困难的部分网站 icon 上传了本地文件
```

## 可用技能

| 技能 | 文件 | 用途 |
| --- | --- | --- |
| `hexo-post-polish` | `.opencode/skills/hexo-post-polish/SKILL.md` | 语雀同步后文章整理（front-matter 规范化 + 图片转 webp + `{% asset_img %}` 导入 + 语雀 `:::info` 转 `{% callout %}`） |
| `blog-publish` | `.opencode/skills/blog-publish/SKILL.md` | 博客发布流程（图片检查 → 功能日志 → 提交 → 摘要 → 部署） |

## 新增文章

1. 使用 `npx hexo new post "标题"` 基于 `scaffolds/post.md` 模板创建。
2. 或通过 `elog sync -e .elog.env` 从语雀同步（见 README「Elog 语雀同步」）。
3. **语雀同步后处理：** 使用 `hexo-post-polish` skill 规范化 front-matter，图片全部转 webp 并以 `{% asset_img %}` 导入（超过 700px 限制为 70%），语雀 `:::info` 等语法转为 `{% callout %}`。
4. 文章中使用 `{% callout %}` 而非已弃用的 `{% note %}` / `{% notel %}`（详见 [Callout 文档](https://redefine-docs.ohevan.com/zh/docs/modules/callout)）。
5. **不要在 Markdown 正文开头写 `#` 标题**——标题只在 front-matter 的 `title` 字段中定义，否则会重复显示。

### 图片存储与引用

项目已启用[文章资源文件夹](https://hexo.io/zh-cn/docs/asset-folders)（`post_asset_folder: true`），并配置了 `marked` 的 `prependRoot` 和 `postAsset` 选项，支持在 Markdown 中直接使用相对路径嵌入图片。

- 使用 `hexo new post` 创建文章时，Hexo 会自动在 `source/_posts/` 下创建与文章同名的资源文件夹。
- 将文章专属图片放入对应的资源文件夹中。
- 文章内使用 Markdown 语法 `![](image.jpg)` 引用，构建时自动解析为正确的绝对路径。
- 需要控制正文图片宽度时，使用 `{% asset_img img-width-70 image.jpg '"图片标题" "替代文本"' %}`；class 写在文件名前，可选值为 `img-width-50`、`img-width-70`、`img-width-90`，移动端均自动显示为 100% 宽度。
- 跨文章共用的图片放入 `source/images/`，引用路径为 `/images/<filename>`。

## 作品集维护

- 作品集不是文章，页面入口固定为 `source/portfolio/index.md`，不要移动到 `source/_posts/`。
- 项目内容只在 `source/_data/portfolio.yml` 中维护；`game_content` 和 `work_content` 使用 YAML `|` 块保存 Markdown。
- 项目显示顺序与 `source/_data/portfolio.yml` 中的排列顺序一致；页面使用 `template: portfolio` 在模板阶段读取最新数据，不依赖 Markdown 标签缓存。
- `engines`、`roles`、`types` 使用受控数组值，不要合并为自然语言字符串，以便未来直接添加筛选控件。
- `year` 用于年份筛选，`sort_date` 使用 `YYYY-MM-DD` 格式并用于排序扩展，`period` 仅用于展示。
- 作品集图片放入 `source/portfolio/assets/`，引用格式为 `/portfolio/assets/<filename>`。
- 相关入口写入 `links` 数组；站内链接使用站点绝对路径，外部链接设置 `external: true`，渲染时统一复用 Redefine `{% button %}`。
- 弹窗正文使用纵向 Markdown 图文流，不要默认引入幻灯片；只有在明确新增媒体画廊需求时再扩展。

## 质量工具

项目当前**没有配置** linting、格式化工具（ESLint、Prettier 等）、Git hooks 或 CI/CD 流水线。不要尝试运行 `npm run lint` 或类似命令，这些脚本不存在。

## 注意事项

- `.elog.env`、`db.json`、`public/`、`.deploy_git/`、`.deploy*/` 已被 gitignore，不要提交。
- 远程仓库 `isaacthemouse.github.io` 的 `master` 分支是源码同步分支（本地 `master` 跟踪 `origin/master`，提交后执行 `git push origin master`）；`gh-pages` 是部署产物分支，勿手动修改；`legacy` 是旧站静态文件备份分支，仅归档。凭据（GitHub Token、语雀密码等）只应存在于 `.elog.env` 或环境变量中，绝对不能写入配置文件或提交到仓库。
- `docs/` 下只有语雀同步的 `.md` 源文件（`docs/feishu/*.md`）被 git 跟踪，作为同步内容 diff 的基线；`docs/feishu/<标题>/` 图片文件夹及其他 docs 内容仍被 gitignore，不要提交。同步后可用 `git diff docs/feishu/` 确认语雀端更新了哪些内容。
- `_config.yml` 中的 `url` 是占位值 `http://example.com`，真实站点 URL 在 `_config.redefine.yml` 中配置为 `https://isaacthemouse.github.io`。
- 全局图片引用路径格式为 `/images/<filename>`，对应 `source/images/<filename>`。文章专属图片使用相对路径 `![](filename.ext)`，存放于文章同名的资源文件夹中。
- 不要修改 `public/` 或 `.deploy_git/` 中的文件——它们会在下次构建时被覆盖。

