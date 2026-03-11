# POCASTER'S BLOG

这是我的个人博客网站，基于 Beautiful Jekyll 主题构建，用于分享我的想法、经验和创作。

## 网站特点

- 🎨 简洁优雅的设计风格
- 📱 完全响应式布局，支持各种设备
- 🔍 内置文章搜索功能
- 🏷️ 文章标签分类系统
- 📰 RSS 订阅支持
- 💬 社交媒体集成

## 技术栈

- Jekyll 静态网站生成器
- Beautiful Jekyll 主题
- GitHub Pages 托管

## 本地开发

1. 确保已安装 Ruby 和 Bundler
2. 克隆仓库：
   ```bash
   git clone https://github.com/pocaster/pocaster.github.io.git
   cd pocaster.github.io
   ```
3. 安装依赖：
   ```bash
   bundle install
   ```
4. 本地运行：
   ```bash
   bundle exec jekyll serve
   ```
5. 访问 `http://localhost:4010` 预览网站（端口见 `_config.yml` 中的 `port`）

## 项目结构

- **`_posts/`**、**`_drafts/`**：正式文章与草稿（仅此两处；草稿不会发布，本地预览可用 `bundle exec jekyll serve --drafts`）
- **`_layouts/`**、**`_includes/`**、**`_data/`**：主题与站点模板、数据（如 `_data/ui-text.yml`）
- **`assets/`**：样式、脚本、图片；主题文件与站点自定义文件说明见 [assets/README.md](assets/README.md)
- **`scripts/`**：建站与内容相关脚本（如 `create_post.py`），建议在项目根目录执行 `python scripts/create_post.py`
- **根目录**：`_config.yml`、`index.html`、`aboutme.md`、`404.html`、`tags.html`、`feed.xml`、`CNAME` 等 Jekyll/Pages 约定文件，请勿移动

## 联系方式

- Email: helloandone@gmail.com
- GitHub: [@thedeathsheep](https://github.com/thedeathsheep)

## 许可证

本项目基于 MIT 许可证开源。详见 [LICENSE](LICENSE) 文件。

---

© 2024 POCASTER / Inevitable-Event Studio. 保留所有权利。
