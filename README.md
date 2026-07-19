# 老鼠洞里有什么

这是一个由 [Hexo](https://hexo.io/) 驱动、使用 [Redefine](https://github.com/EvanNotFound/hexo-theme-redefine) 主题的个人博客项目。站点源文件在本仓库维护，静态产物通过 `hexo-deployer-git` 部署到 GitHub Pages 仓库的 `gh-pages` 分支。

## 项目结构

```text
.
├── _config.yml             # Hexo 主配置，包含主题、生成和部署配置
├── _config.redefine.yml    # Redefine 主题配置
├── elog.config.js          # Elog 同步配置
├── scripts/                # 站点级 Hexo 脚本（自定义标签插件等）
│   └── columns.js          # 自定义 {% columns %} 分栏标签
├── source/
│   ├── _posts/             # Hexo 实际发布的文章
│   ├── _data/links.yml     # 友链页数据
│   ├── images/             # 会被发布到 /images/ 的本地图片
│   ├── links/              # 友链页面
│   └── tags/               # 标签页面
├── docs/                   # 同步、整理和备份用文档，不直接等同于发布目录
├── public/                 # Hexo 生成产物，已被 gitignore
└── .deploy_git/            # hexo-deployer-git 使用的部署工作目录，已被 gitignore
```

## 本地开发

安装依赖：

```powershell
npm install
```

启动本地预览：

```powershell
npx hexo server
```

生成静态文件：

```powershell
npx hexo generate
```

清除缓存（`db.json`）和已生成的静态文件（`public/`）：

```powershell
npx hexo clean
```

常用脚本来自 `package.json`：

```json
{
  "build": "hexo generate",
  "clean": "hexo clean",
  "deploy": "hexo deploy",
  "server": "hexo server"
}
```

## Hexo 与主题配置

主配置在 `_config.yml`：

- `theme: redefine` 启用 Redefine 主题。
- `all_minifier: true` 启用 `hexo-all-minifier`，用于压缩生成后的静态资源。
- `deploy` 使用 `hexo-deployer-git`。

主题配置在 `_config.redefine.yml`（v2.9.0）：

- `info` 维护站点标题、作者和站点 URL。
- `home_banner` 维护主页 banner、明暗模式图片和首页标题。社交链接使用数组格式以保证排序稳定。
- `page_templates` 维护主题提供的页面模板行为，例如友链页和标签页。
- `cdn.enable: false`，当前未启用 Redefine 的主题资源 CDN。
- 支持 `{% callout %}` 提示模块（替代已弃用的 `{% note %}` / `{% notel %}`）。
- 新增评论系统支持：Utterances、Artalk（当前使用 Waline）。

本地图片放在 `source/images/`，在文章或主题配置中使用 `/images/<filename>` 引用。修改主题中引用的图片路径时，需要确认对应文件确实存在于 `source/images/`。

## 内容维护

文章发布目录是 `source/_posts/`。新增文章可以使用：

```powershell
npx hexo new post "文章标题"
```

友链页由 `source/links/index.md` 和 `source/_data/links.yml` 共同维护。当前数据格式示例：

```yaml
- links_category: Friends
  has_thumbnail: true
  list:
    - name: Feishiko
      link: https://feishiko.top/
      description: 我有 8 年的独立游戏开发经验
      avatar: https://feishiko.top/assets/img/logo.png
      thumbnail: https://feishiko.top/assets/card-XNCB85eX.png
```

内容更新也建议使用规范化提交信息。遵循 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```text
<type>(<scope>): <summary>
```

常用 type：`feat`（新内容/功能）、`fix`（修复）、`docs`（文档）、`chore`（杂项维护）。

例如：

```text
feat(links): add new friend link
feat(posts): publish hexo deploy note
docs: update README deployment instructions
chore: update hexo to latest version
```

凡是涉及特定页面的内容更新都使用 `feat(<pagename>): <summary>` 的格式，例如：

```text
✨ feat(bookmarks): 新建5个分类，添加部分网站链接
- 新建了5个分类：免费资产、游戏引擎、GameJam 官网、竞赛官网、行业资料
- 为各个分类添加了少量网站
- 为访问困难的部分网站 icon 上传了本地文件
```

## 远程部署

项目使用 [hexo-deployer-git](https://github.com/hexojs/hexo-deployer-git) 的一键部署方式。当前 `_config.yml` 配置为：

```yaml
deploy:
  type: git
  repo: https://github.com/IsaacTheMouse/isaacthemouse.github.io
  branch: gh-pages
```

部署流程：

```powershell
npx hexo clean
npx hexo deploy
```

`hexo-deployer-git` 会在部署前自动生成静态文件，因此无需手动执行 `hexo generate`。部署使用 `.deploy_git/` 作为工作目录，并将生成后的静态站点推送到配置的远程仓库分支。`public/` 和 `.deploy_git/` 都是生成产物，不应作为源文件提交。

注意：`_config.yml` 中的 `url` 仍是 Hexo 默认示例值时，应在正式部署前改为实际站点地址；当前主题配置 `_config.redefine.yml` 中的站点 URL 是 `https://isaacthemouse.github.io`。

## Elog 语雀同步

本项目使用的是 [LetTTGACO/elog](https://github.com/LetTTGACO/elog)，不是 `yuque-hexo-with-cdn`。

Elog 用于从语雀等在线写作平台同步 Markdown，并可在同步过程中处理图片。当前 `elog.config.js` 的关键配置：

- `write.platform: 'yuque-pwd'`：使用语雀账号密码方式同步。
- `write['yuque-pwd'].login` 和 `repo`：通过环境变量读取语雀个人路径和知识库路径。
- `deploy.platform: 'local'`：同步到本地目录。
- `deploy.local.outputDir: './docs/feishu'`：同步输出目录，文章以文档标题命名。
- `deploy.local.frontMatter.enable: true`：输出 Front Matter。
- `image.enable: true`、`image.platform: 'local'`：启用本地图片存储。
- `image.local.outputDir: './docs/feishu'`：图片输出目录，与文档同目录。
- `image.local.prefixKey: '/images'`：图片路径前缀（启用 `imagePathExt` 后由拓展点接管）。
- `image.local.imagePathExt: './elog.image-path-ext.js'`：自定义图片路径拓展点，按文档标题为文件夹存放图片，Markdown 中图片引用为纯文件名格式（兼容 Hexo 文章资源文件夹），实际路径为 `./docs/feishu/<标题>/image.png`。

Elog CLI 当前没有写入 `package.json` 依赖，需要在本机安装：

```powershell
npm install -g @elog/cli
```

同步前需要准备 `.elog.env`。该文件已被 `.gitignore` 忽略，不要提交。至少会用到这些变量：

```text
YUQUE_USERNAME=
YUQUE_PASSWORD=
YUQUE_LOGIN=
YUQUE_REPO=
```

图片采用本地存储后不再需要 GitHub 相关环境变量。

执行同步：

```powershell
elog sync -e .elog.env
```

如果需要强制同步删除，可使用：

```powershell
elog sync -e .elog.env --force
```

Elog 同步后文章和图片均进入 `./docs/feishu/`，图片按文档标题分文件夹存放（`./docs/feishu/<标题>/image.png`），Markdown 中以纯文件名 `![](image.png)` 引用，与 Hexo 文章资源文件夹行为一致，无需手动整理。

## 图片存储与访问

图片维护优先考虑两件事：降低体积，以及保证访问稳定性。

推荐策略：

- 面向现代浏览器时，优先将大图转为 WebP，降低图片体积。
- 对需要保留高清原图的内容，可额外提供归档链接，而不是直接塞进文章正文。
- Hexo 构建阶段启用 `hexo-all-minifier`，减少静态资源体积。
- 当前图片量不大时，先使用 GitHub 存储，不启用 CDN。
- 后续图片数量明显增长时，再评估 Cloudflare R2、腾讯云 COS 或其他对象存储。
- Redefine 支持主题资源 CDN，但当前 `_config.redefine.yml` 中 `cdn.enable` 为 `false`。

可选存储方案对比：

| 存储方式 | 费用 | 备注 |
| --- | --- | --- |
| 公共图床 | 通常免费 | 可能有稳定性和长期可用风险 |
| GitHub | 免费 | 部分网络环境访问可能较差 |
| Cloudflare R2 | 有免费额度 | 适合后续接入对象存储和自定义域名 |
| 腾讯云 COS / 阿里云 OSS | 按量计费 | 存储和流量都需要核算 |

上传和整理图片可以使用 [PicList](https://piclist.cn/)。它适合在上传前完成压缩、格式转换、规则化重命名，也支持多配置切换和快捷上传剪贴板文件。

## 写作指导

请不要在 Markdown 文章开头加上 # 标题

请仅在 Markdown 文件的 `front-matter` 中的 `title:` 属性中写上你的标题，否则会出现复数标题。

### 自定义分栏标签 columns

`scripts/columns.js` 注册了站点级自定义标签 `{% columns %}`，用于在文章中实现多栏并排布局（如图文左右分栏）：

```markdown
{% columns ratio=3:7 gap=24 %}
<!-- column -->
![](image.jpg)
<!-- column -->
这里写正文，支持 Markdown 和嵌套其他标签。
{% endcolumns %}
```

参数说明（全部可选，具名传参）：

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `ratio` | 分栏比例，如 `3:7`、`1:2:1`，段数即栏数 | 等分 |
| `cols` | 栏数（与 `ratio` 同时给出时以 `ratio` 为准） | 由 `<!-- column -->` 数量推断 |
| `gap` | 栏间距，纯数字自动补 `px`，支持 CSS 单位 | `16px` |
| `fill` | `fill=true` 时列内图片等比放大填满列宽（小于列宽的图片会被放大，低分辨率图会模糊） | `false` |

行为说明：

- 各栏内容以 `<!-- column -->` 注释行分隔，栏内 Markdown 与嵌套标签正常渲染，文章资源文件夹中的图片相对路径也会正确解析。
- 容器使用 `align-items: flex-start`，图片栏不会被相邻长文本栏拉伸行高、破坏显示比例。
- 各栏首个子元素的上边距和末尾子元素的下边距被归零，图片列与文字列严格顶对齐；分栏块与上下文的间距由容器统一的 `margin: 1rem 0` 提供。
- `ratio`/`cols` 与实际分隔块数不符时，构建时输出警告并以实际块数为准。
- 通过 `hexo.extend.injector` 注入了一段全局 CSS：屏幕宽度不超过 768px 时各栏自动上下堆叠。

## 安全注意

- `.elog.env` 不能提交。
- 如果本地凭据曾经出现在对话、日志、截图或提交记录中，应及时轮换。
- `GITHUB_TOKEN`、语雀账号密码、对象存储密钥都应只放在本地环境变量或 CI Secret 中。
- 不要把部署 token 直接写入 `_config.yml` 或 `elog.config.js`。

## 参考资料

- [Hexo GitHub Pages 文档](https://hexo.io/zh-cn/docs/github-pages)
- [Hexo 一键部署](https://hexo.io/zh-cn/docs/one-command-deployment)
- [hexo-deployer-git](https://github.com/hexojs/hexo-deployer-git)
- [hexo-theme-redefine](https://github.com/EvanNotFound/hexo-theme-redefine)
- [Redefine 文档](https://redefine-docs.ohevan.com/)
- [Elog](https://github.com/LetTTGACO/elog)
- [Elog 文档](https://elog.1874.cool/)
