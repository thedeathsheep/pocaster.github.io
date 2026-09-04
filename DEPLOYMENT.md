# Inevitable Event：项目配置与更新流程

本文档记录个人主页的本地开发、提交和服务器部署方式。

## 0. 项目资料

项目定位、信息架构、关键页面、关联部署及公开材料边界统一记录在 [`PROJECT.md`](PROJECT.md)。视觉和文字规则记录在 [`STYLE.md`](STYLE.md)，当前工作状态记录在 [`CURRENT.md`](CURRENT.md)。

## 0.1 仓库目录说明

```text
pocaster.github.io/
├── _config.yml                 # Jekyll 全局配置
├── _layouts/                   # 页面布局
├── _includes/                  # 可复用页面组件
├── assets/css/                 # 全局样式与案例页样式
├── assets/img/projects/        # 项目截图、原型图和研究证据
├── _posts/                     # 文章正文，文件名决定文章日期与永久链接
├── projects/                   # 产品案例 Markdown 页面
├── index.html                  # 首页
├── about.md                    # About 页面
├── writing.md                  # Writing 页面
├── DEPLOYMENT.md               # 本文档
└── .github/workflows/          # 自动构建与部署流程
```

### 案例素材目录

```text
assets/img/projects/infinite-canvas/
├── node-management.png
└── evidence/
    ├── canvas-overview.png
    ├── asset-library-release.png
    ├── canvas-nodes.png
    ├── canvas-comment-mode.png
    ├── canvas-return-node.png
    ├── canvas-system-map.svg
    └── canvas-entry-flow.svg

assets/img/projects/3d-directors-desk/
├── director-panel.png
└── evidence/
    ├── director-canvas-overview.png
    ├── director-world-setup.png
    ├── director-node-centered.png
    ├── director-panel-annotated.png
    ├── role-panel-annotated.png
    ├── golden-task.svg
    └── control-layer.svg
```

案例页采用 `case_format: "dossier"`，由以下组件组成：

```text
Situation → Evidence → Tension → Decisions → Prototype → Validation → Archive
```

对应组件位于：

```text
_includes/case-evidence.html
_includes/case-decision-ledger.html
_includes/case-source-index.html
assets/css/case-study.css
```

原始飞书文档、客户资料和内部链接不直接放入公开页面。公开案例只保留经过整理的研究结论、产品判断、可发布截图和自绘示意图。

## 1. 项目与服务器

| 项目 | 配置 |
| --- | --- |
| 本地仓库 | `D:\projects\pocaster.github.io` |
| GitHub 仓库 | `https://github.com/thedeathsheep/pocaster.github.io` |
| 当前部署分支 | `redesign-frame-system` |
| 服务器 | `139.155.139.62` |
| 服务器用户 | `ubuntu` |
| 网站目录 | `/var/www/portfolio` |
| 主域名 | `https://inevitable-event.com` |
| Nginx 配置 | `/etc/nginx/sites-enabled/portfolio-sites` |

## 2. 本地预览

在 PowerShell 中执行：

```powershell
cd D:\projects\pocaster.github.io
bundle exec jekyll serve --host 127.0.0.1 --port 4000 --livereload
```

浏览器访问：

```text
http://127.0.0.1:4000/
```

停止服务：在运行窗口按 `Ctrl+C`。

## 3. 修改前检查

```powershell
cd D:\projects\pocaster.github.io
git status
git branch --show-current
```

确认当前分支是：

```text
redesign-frame-system
```

仓库中可能存在其他未提交修改。不要使用 `git add .`，除非确认所有修改都应该一起提交。优先按文件添加：

```powershell
git add projects/infinite-canvas.md
git add assets/css/case-study.css
```

## 4. 本地构建检查

```powershell
bundle exec jekyll build
```

构建成功会显示：

```text
done
```

未来日期文章被跳过属于正常提示。旧文章中的 Liquid warning 需要单独修复，不影响本次构建结果。

## 5. 提交并自动部署

提交修改：

```powershell
git add <需要提交的文件>
git commit -m "简短描述本次修改"
git push origin redesign-frame-system
```

推送后，GitHub Actions 会自动：

1. 构建 Jekyll 网站；
2. 将 `_site` 上传到服务器临时目录；
3. 备份当前网站；
4. 替换 `/var/www/portfolio`；
5. 检查并重载 Nginx。

工作流文件：

```text
.github/workflows/deploy-farawayfromicu.yml
```

GitHub Actions 页面：

```text
仓库 → Actions → Deploy portfolio to Tencent Cloud
```

## 6. GitHub Secret 配置

工作流需要一个 Secret：

```text
名称：DEPLOY_PRIVATE_KEY
```

Secret 的值是私钥文件的完整内容，不是文件路径，也不是 `.pub` 公钥。

本地私钥文件：

```text
C:\Users\whatk\.ssh\codex_tencent_139_155_139_62
```

复制私钥到剪贴板：

```powershell
Get-Content -Raw "C:\Users\whatk\.ssh\codex_tencent_139_155_139_62" | Set-Clipboard
```

然后在 GitHub 仓库中进入：

```text
Settings → Secrets and variables → Actions → New repository secret
```

不要把私钥提交进 Git，也不要发送到聊天或公开文档。

## 7. 服务器手动部署备用流程

只有 GitHub Actions 失败时才使用手动流程。

本地打包并上传：

```powershell
cd D:\projects\pocaster.github.io
bundle exec jekyll build
tar -czf deploy.tar.gz -C _site .
$key = "C:\Users\whatk\.ssh\codex_tencent_139_155_139_62"
scp -i $key deploy.tar.gz ubuntu@139.155.139.62:/tmp/
ssh -i $key ubuntu@139.155.139.62
```

进入服务器后执行：

```bash
sudo cp -a /var/www/portfolio /var/www/portfolio-backup-$(date +%Y%m%d-%H%M%S)
sudo find /var/www/portfolio -mindepth 1 -maxdepth 1 -exec rm -rf {} +
sudo tar -xzf /tmp/deploy.tar.gz -C /var/www/portfolio
sudo chown -R www-data:www-data /var/www/portfolio
sudo find /var/www/portfolio -type d -exec chmod 755 {} \;
sudo find /var/www/portfolio -type f -exec chmod 644 {} \;
sudo nginx -t && sudo systemctl reload nginx
```

验证：

```bash
curl -I https://inevitable-event.com
curl -I https://inevitable-event.com/projects/infinite-canvas/
```

返回 `HTTP/1.1 200 OK` 即表示站点正常响应。

## 8. 常见问题

### `not a git repository`

说明当前 PowerShell 不在项目目录。执行：

```powershell
cd D:\projects\pocaster.github.io
```

### `Permission denied (publickey)`

确认使用的是不带 `.pub` 的私钥：

```powershell
$key = "C:\Users\whatk\.ssh\codex_tencent_139_155_139_62"
ssh -i $key ubuntu@139.155.139.62
```

### 本地 `127.0.0.1:4000` 被拒绝连接

说明 Jekyll 服务没有运行。重新执行本地预览命令即可。

### GitHub Actions 构建成功但部署失败

依次检查：

1. `DEPLOY_PRIVATE_KEY` 是否填入私钥全文；
2. 工作流是否运行在 `redesign-frame-system` 分支；
3. 服务器 SSH 用户是否仍为 `ubuntu`；
4. `/var/www/portfolio` 是否存在；
5. 服务器上的 `ubuntu` 用户是否可以执行 `sudo`。

### 修改后线上没有变化

先确认 GitHub Actions 已完成，再强制刷新浏览器：

```text
Windows：Ctrl+F5
```

也可以检查线上文件时间：

```bash
curl -I https://inevitable-event.com/projects/infinite-canvas/
```
