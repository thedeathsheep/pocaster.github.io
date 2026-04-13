# farawayfrom.icu Deployment Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把当前 Jekyll 博客接入 `farawayfrom.icu` 的长期部署结构，先实现博客自动部署到 Windows Server 根目录，并为 `/about/` 与 `/games/` 预留稳定路径。

**Architecture:** 保留 Jekyll 作为博客静态站生成器，在 GitHub Actions 中新增 Windows Server 部署工作流，使用 SSH 密钥登录服务器并把构建产物同步到 `C:\inetpub\wwwroot\farawayfromicu\`。同时调整站点配置与导航，使根路径适配 `farawayfrom.icu`，并在仓库中预留 `about` 与 `games` 入口页。

**Tech Stack:** Jekyll, GitHub Actions, OpenSSH, Windows IIS, PowerShell

---

### Task 1: Align Site Config With farawayfrom.icu

**Files:**
- Modify: `_config.yml`
- Test: `bundle exec jekyll build`

- [ ] **Step 1: Write the failing configuration expectation**

确认以下目标与当前配置不一致：

```yaml
url: "https://farawayfrom.icu"
navbar-links:
  About: "about"
  Games: "games"
```

当前不满足点：
- `url` 仍为 `https://www.inevitable-event.com`
- 导航仍为 `About Me / Resources / Leave this page`

- [ ] **Step 2: Run build to capture current baseline**

Run: `bundle exec jekyll build`

Expected:
- BUILD SUCCESS
- 生成站点仍引用旧域名 `www.inevitable-event.com`

- [ ] **Step 3: Update site config**

将 `_config.yml` 中站点 URL 和导航更新为：

```yaml
url: "https://farawayfrom.icu"

navbar-links:
  About: "about"
  Games: "games"
```

保留已有作者、主题和其余 Jekyll 配置不变。

- [ ] **Step 4: Rebuild and verify config change**

Run: `bundle exec jekyll build`

Expected:
- BUILD SUCCESS
- 生成结果中的绝对链接指向 `https://farawayfrom.icu`

- [ ] **Step 5: Commit**

```bash
git add _config.yml
git commit -m "config: point site to farawayfrom.icu"
```

### Task 2: Add Managed Entry Pages For /about/ And /games/

**Files:**
- Create: `about.md`
- Create: `games.md`
- Test: `bundle exec jekyll build`

- [ ] **Step 1: Write the failing page expectation**

定义两个页面必须存在：

- `/about/`：个人主页占位页
- `/games/`：游戏索引占位页

当前仓库缺少：

```text
about.md
games.md
```

- [ ] **Step 2: Run build and verify routes are missing**

Run: `bundle exec jekyll build`

Expected:
- BUILD SUCCESS
- `_site/about/index.html` 不存在
- `_site/games/index.html` 不存在

- [ ] **Step 3: Create minimal managed pages**

创建 `about.md`：

```md
---
layout: page
title: About
permalink: /about/
---

这里将作为个人主页入口页，后续补充个人介绍、经历、作品与联系方式。
```

创建 `games.md`：

```md
---
layout: page
title: Games
permalink: /games/
---

这里将作为 Web 游戏索引页，后续统一收录部署在 `/games/<slug>/` 下的项目。
```

- [ ] **Step 4: Rebuild and verify generated routes**

Run: `bundle exec jekyll build`

Expected:
- BUILD SUCCESS
- `_site/about/index.html` 存在
- `_site/games/index.html` 存在

- [ ] **Step 5: Commit**

```bash
git add about.md games.md
git commit -m "feat: add about and games landing pages"
```

### Task 3: Replace GitHub Pages Workflow With Server Deployment Workflow

**Files:**
- Modify: `.github/workflows/jekyll-gh-pages.yml`
- Create: `.github/workflows/deploy-farawayfromicu.yml`
- Test: `.github/workflows/*.yml` syntax review

- [ ] **Step 1: Write the failing workflow expectation**

目标工作流行为：

- push 到 `main` 时构建 Jekyll
- 通过 SSH 密钥连接 Windows Server
- 上传构建产物到服务器临时目录
- 在服务器端备份现站并解压到 `C:\inetpub\wwwroot\farawayfromicu\`

当前 `.github/workflows/jekyll-gh-pages.yml` 仅做：

```yaml
uses: actions/deploy-pages@v4
```

这不能满足服务器部署目标。

- [ ] **Step 2: Inspect current workflow contract**

Run: `Get-Content .github/workflows/jekyll-gh-pages.yml`

Expected:
- 只有 GitHub Pages build/deploy 逻辑
- 没有 SSH、artifact sync、服务器备份步骤

- [ ] **Step 3: Add server deployment workflow**

新增 `.github/workflows/deploy-farawayfromicu.yml`，核心结构应包含：

```yaml
name: Deploy Blog To farawayfrom.icu Server

on:
  push:
    branches: ["main"]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.3'
          bundler-cache: true
      - run: bundle exec jekyll build
      - run: tar -a -cf site.zip -C _site .
      - uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.FARAWAY_SSH_HOST }}
          username: ${{ secrets.FARAWAY_SSH_USER }}
          key: ${{ secrets.FARAWAY_SSH_KEY }}
          source: "site.zip"
          target: "C:/inetpub/wwwroot/"
      - uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.FARAWAY_SSH_HOST }}
          username: ${{ secrets.FARAWAY_SSH_USER }}
          key: ${{ secrets.FARAWAY_SSH_KEY }}
          script: |
            powershell -NoProfile -ExecutionPolicy Bypass -Command "
            $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss';
            $siteRoot = 'C:\inetpub\wwwroot\farawayfromicu';
            $backupDir = 'C:\inetpub\wwwroot\_deploy_backups\farawayfromicu-' + $timestamp;
            New-Item -ItemType Directory -Path $backupDir -Force | Out-Null;
            Get-ChildItem -Force $siteRoot | ForEach-Object { Move-Item -LiteralPath $_.FullName -Destination $backupDir -Force };
            tar -xf C:\inetpub\wwwroot\site.zip -C $siteRoot;
            Remove-Item -LiteralPath C:\inetpub\wwwroot\site.zip -Force;
            "
```

同时将现有 `.github/workflows/jekyll-gh-pages.yml` 改为以下两者之一：

- 删除
- 或改为仅手动触发并注明已迁移服务器部署

优先选删除，避免双重发布。

- [ ] **Step 4: Verify workflow definitions**

Run: `Get-Content .github/workflows/deploy-farawayfromicu.yml`

Expected:
- 触发条件、Jekyll build、压缩、SCP、SSH 解压步骤齐全
- 使用 Secrets，不写死密码

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/jekyll-gh-pages.yml .github/workflows/deploy-farawayfromicu.yml
git commit -m "ci: deploy blog to farawayfromicu server"
```

### Task 4: Document Required GitHub Secrets And Server Prerequisites

**Files:**
- Modify: `README.md`
- Test: manual review of README section

- [ ] **Step 1: Write the failing documentation expectation**

README 必须明确说明服务器部署所需的 Secrets 与服务器条件。当前 README 只有本地开发说明，不包含：

- `FARAWAY_SSH_HOST`
- `FARAWAY_SSH_USER`
- `FARAWAY_SSH_KEY`
- IIS 目标目录
- 服务器需启用 OpenSSH

- [ ] **Step 2: Review current README baseline**

Run: `Get-Content README.md`

Expected:
- 有 Jekyll 本地开发流程
- 无自动部署到 Windows Server 的说明

- [ ] **Step 3: Add deployment operations section**

在 `README.md` 中新增一节，至少包含以下内容：

```md
## 部署到 farawayfrom.icu

博客默认部署目标：

- 服务器：`farawayfrom.icu`
- 目录：`C:\inetpub\wwwroot\farawayfromicu\`

GitHub Actions 依赖以下 Secrets：

- `FARAWAY_SSH_HOST`
- `FARAWAY_SSH_USER`
- `FARAWAY_SSH_KEY`

服务器要求：

- 已启用 OpenSSH Server
- IIS 站点根目录存在并可写
- 备份目录：`C:\inetpub\wwwroot\_deploy_backups\`
```

- [ ] **Step 4: Review documentation for completeness**

Run: `Get-Content README.md`

Expected:
- 能独立指导仓库维护者配置自动部署
- 没有依赖口头背景信息

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: add farawayfromicu deployment setup"
```

### Task 5: Verify End-To-End Deployment Contract

**Files:**
- Test: local build output
- Test: workflow file review
- Test: deployment smoke checklist in README or notes

- [ ] **Step 1: Write the failing verification checklist**

需要验证以下行为：

- 本地 `bundle exec jekyll build` 成功
- 首页、`/about/`、`/games/` 三个路由都能生成
- 工作流不再指向 GitHub Pages
- 服务器部署目标目录固定为 `C:\inetpub\wwwroot\farawayfromicu\`

在实现前，这个清单无法全部满足。

- [ ] **Step 2: Run local build verification**

Run: `bundle exec jekyll build`

Expected:
- BUILD SUCCESS
- `_site/index.html`
- `_site/about/index.html`
- `_site/games/index.html`

- [ ] **Step 3: Review workflow targets**

Run: `Get-ChildItem .github/workflows; Get-Content .github/workflows/deploy-farawayfromicu.yml`

Expected:
- 存在服务器部署 workflow
- 不存在自动 GitHub Pages 发布逻辑

- [ ] **Step 4: Record post-merge operator checklist**

在执行合并后，需要手工完成一次性配置：

```text
1. 在服务器生成或安装部署专用 SSH 密钥
2. 将公钥写入 Administrator 的 authorized_keys
3. 在 GitHub 仓库 Secrets 中配置 FARAWAY_SSH_HOST / USER / KEY
4. 手动触发一次 workflow_dispatch 验证首发
5. 访问 farawayfrom.icu/、/about/、/games/ 做 smoke test
```

- [ ] **Step 5: Commit**

```bash
git add _config.yml about.md games.md .github/workflows README.md
git commit -m "feat: prepare farawayfromicu deployment flow"
```
