# farawayfrom.icu Site Structure Design

## Goal

把 `farawayfrom.icu` 作为部署在 Windows Server 上的个人网站总入口，其中博客作为根路径首页，个人主页放在 `/about/`，后续 Web 游戏统一挂载在 `/games/<slug>/`。

## Decisions

### Domain Role

- 主域名使用 `farawayfrom.icu`
- `farawayfrom.icu/` 直接展示博客首页
- 当前 `www.inevitable-event.com` 不纳入这次结构调整范围

### URL Structure

- `/`：博客首页与文章内容
- `/about/`：个人主页
- `/games/`：游戏索引页
- `/games/<slug>/`：单个 Web 游戏

这个结构优先满足两个目标：

- 访问博客时不增加额外入口跳转
- 后续新增项目时不需要重新设计整站 URL

### Server Directory Layout

IIS 站点物理目录统一放在：

- `C:\inetpub\wwwroot\farawayfromicu\`

推荐目录布局：

- `C:\inetpub\wwwroot\farawayfromicu\index.html` 及博客静态资源
- `C:\inetpub\wwwroot\farawayfromicu\about\`
- `C:\inetpub\wwwroot\farawayfromicu\games\`
- `C:\inetpub\wwwroot\farawayfromicu\games\<slug>\`
- `C:\inetpub\wwwroot\_deploy_backups\` 用于部署备份

### Repository Responsibility

当前博客仓库负责：

- 生成博客根路径内容
- 提供站点级导航
- 可以在后续纳入 `/about/` 和 `/games/` 索引页

后续独立游戏仓库负责：

- 各自项目构建
- 发布到固定目录 `C:\inetpub\wwwroot\farawayfromicu\games\<slug>\`

服务器只负责托管构建产物，不承担手工编辑站点内容的职责。

## Deployment Strategy

### Blog Deployment

博客仓库继续使用 Jekyll 构建静态文件，并部署到：

- `C:\inetpub\wwwroot\farawayfromicu\`

部署方式从“手工密码上传”迁移到：

- GitHub Actions
- SSH 密钥登录
- 固定目标目录同步

### Game Deployment

每个游戏项目独立配置自动部署，发布到：

- `C:\inetpub\wwwroot\farawayfromicu\games\<slug>\`

这样可以让博客和游戏互不覆盖，也方便单独回滚。

## Navigation Model

博客作为首页时，导航至少需要包含：

- `Blog`
- `About`
- `Games`

其中：

- `Blog` 指向 `/`
- `About` 指向 `/about/`
- `Games` 指向 `/games/`

后续新增项目时，只需要更新 `Games` 索引页，而不需要改变首页职责。

## Error Handling And Rollback

- 每次部署前保留服务器端备份
- 博客和游戏分别部署，避免一个项目发布影响另一个项目
- 发布目录固定后，不再通过手工远程桌面复制文件进行日常更新

## Constraints

- 博客根路径部署没有 base path 问题，适合放在 `/`
- 游戏若依赖相对资源路径，需要在各自仓库中确认适配 `/games/<slug>/`
- `about/` 与 `games/` 页面后续应纳入版本控制，不应长期手工维护

## Success Criteria

- 访问 `farawayfrom.icu/` 时显示博客首页
- 访问 `farawayfrom.icu/about/` 时显示个人主页
- 访问 `farawayfrom.icu/games/` 时显示游戏目录页
- 新游戏可以在不影响博客的前提下部署到 `farawayfrom.icu/games/<slug>/`
- 日常发布不再依赖输入服务器密码
