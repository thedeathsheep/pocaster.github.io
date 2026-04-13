# POCASTER'S BLOG

这是我的个人博客网站，基于 Beautiful Jekyll 构建，用于分享想法、经验和创作。

## 网站特点

- 简洁响应式博客布局
- 文章搜索与标签分类
- RSS 订阅支持
- 可扩展的自定义样式与脚本

## 技术栈

- Jekyll
- Beautiful Jekyll
- Windows Server + IIS

## 本地开发

1. 安装 Ruby 和 Bundler
2. 克隆仓库

```bash
git clone https://github.com/pocaster/pocaster.github.io.git
cd pocaster.github.io
```

3. 安装依赖

```bash
bundle install
```

4. 本地运行

```bash
bundle exec jekyll serve
```

5. 访问 `http://localhost:4000`

## 项目结构

- `_posts/`、`_drafts/`：文章与草稿
- `_layouts/`、`_includes/`、`_data/`：站点模板与数据
- `assets/`：样式、脚本、图片等静态资源
- `scripts/`：内容与构建相关脚本
- `_config.yml`：站点主配置

## 联系方式

- Email: helloandone@gmail.com
- GitHub: [@thedeathsheep](https://github.com/thedeathsheep)

## 部署

生产环境部署由 `.github/workflows/deploy-farawayfromicu.yml` 负责。

- 目标目录：`C:\inetpub\wwwroot\farawayfromicu`
- 备份目录：`C:\inetpub\wwwroot\_deploy_backups\farawayfromicu-<timestamp>`
- 必需 GitHub Secrets：`FARAWAY_SSH_HOST`、`FARAWAY_SSH_USER`、`FARAWAY_SSH_KEY`
- 服务器前提：已启用 OpenSSH、IIS 指向目标目录、部署账号有备份与覆盖站点文件权限

## License

MIT. 详见 [LICENSE](LICENSE)。
