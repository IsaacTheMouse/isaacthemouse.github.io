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
| `_config.redefine.yml` | Redefine 主题配置（496 行，包含外观、评论、插件等） | README「Hexo 与主题配置」 |
| `elog.config.js` | Elog 多平台同步配置（读写来源、输出目录、图片处理） | README「Elog 语雀同步」 |
| `source/_posts/` | Hexo 文章发布目录，含各文章的资源文件夹 | README「内容维护」 |
| `source/images/` | 全局图片，构建后映射到 `/images/` | README「图片存储与访问」 |
| `source/_data/links.yml` | 友链页数据 | README「内容维护」 |
| `scaffolds/` | `hexo new` 命令使用的文章模板（draft/page/post） | Hexo 文档 |
| `.elog.env` | Elog 凭据文件，已被 gitignore，禁止提交 | README「安全注意」 |

## 修改代码的约定

- **不要添加注释**，除非用户明确要求。
- 遵循项目已有的代码风格（YAML 缩进为 2 空格，JS 使用单引号）。
- 修改 YAML 配置时保持与现有格式一致。
- 修改 `_config.redefine.yml` 时注意该文件较长，使用精确匹配进行编辑。

## 提交规范

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/)。使用中文编写提交消息。

凡是涉及特定页面的内容更新都使用 `feat(<pagename>): <summary>` 的格式，例如：

```text
✨ feat(bookmarks): 新建5个分类，添加部分网站链接
- 新建了5个分类：免费资产、游戏引擎、GameJam 官网、竞赛官网、行业资料
- 为各个分类添加了少量网站
- 为访问困难的部分网站 icon 上传了本地文件
```

## 新增文章

1. 使用 `npx hexo new post "标题"` 基于 `scaffolds/post.md` 模板创建。
2. 或通过 `elog sync -e .elog.env` 从语雀同步（见 README「Elog 语雀同步」）。
3. 文章中使用 `{% callout %}` 而非已弃用的 `{% note %}` / `{% notel %}`（详见 [Callout 文档](https://redefine-docs.ohevan.com/zh/docs/modules/callout)）。

### 图片存储与引用

项目已启用[文章资源文件夹](https://hexo.io/zh-cn/docs/asset-folders)（`post_asset_folder: true`），并配置了 `marked` 的 `prependRoot` 和 `postAsset` 选项，支持在 Markdown 中直接使用相对路径嵌入图片。

- 使用 `hexo new post` 创建文章时，Hexo 会自动在 `source/_posts/` 下创建与文章同名的资源文件夹。
- 将文章专属图片放入对应的资源文件夹中。
- 文章内使用 Markdown 语法 `![](image.jpg)` 引用，构建时自动解析为正确的绝对路径。
- 跨文章共用的图片放入 `source/images/`，引用路径为 `/images/<filename>`。

## 质量工具

项目当前**没有配置** linting、格式化工具（ESLint、Prettier 等）、Git hooks 或 CI/CD 流水线。不要尝试运行 `npm run lint` 或类似命令，这些脚本不存在。

`.github/dependabot.yml` 仅用于 npm 依赖的自动更新，不涉及构建或部署。

## 注意事项

- `.elog.env`、`db.json`、`public/`、`.deploy_git/`、`.deploy*/` 已被 gitignore，不要提交。
- `_config.yml` 中的 `url` 是占位值 `http://example.com`，真实站点 URL 在 `_config.redefine.yml` 中配置为 `https://isaacthemouse.github.io`。
- 全局图片引用路径格式为 `/images/<filename>`，对应 `source/images/<filename>`。文章专属图片使用相对路径 `![](filename.ext)`，存放于文章同名的资源文件夹中。
- 不要修改 `public/` 或 `.deploy_git/` 中的文件——它们会在下次构建时被覆盖。
- 凭据（GitHub Token、语雀密码等）只应存在于 `.elog.env` 或环境变量中，绝对不能写入配置文件或提交到仓库。

## 参考资料

- [Hexo 文档](https://hexo.io/zh-cn/docs/)
- [Redefine 主题文档](https://redefine-docs.ohevan.com/)
- [Elog 文档](https://elog.1874.cool/)
- [Conventional Commits](https://www.conventionalcommits.org/)
