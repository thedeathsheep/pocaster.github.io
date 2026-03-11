# Assets 目录说明

本目录存放站点静态资源。为便于维护和后续换主题，区分如下：

## 主题相关（Beautiful Jekyll）

- **CSS**: `beautifuljekyll.css`, `beautifuljekyll-minimal.css`, `main.css`, `style.css`, `bootstrap-social.css`, `collapsible.css`, `staticman.css`, `pygment_highlights.css`
- **JS**: `beautifuljekyll.js`, `collapsible.js`, `staticman.js`

修改主题样式时请优先通过 `custom-styles.css` 覆盖，避免直接改上述文件。

## 站点自定义

- **CSS**: `custom-styles.css`, `sticky-posts.css`, `cyberpunk-home.css`
- **JS**: `mermaid.js`, `fix-scroll.js`, `cyberpunk-effects.js`, `tesseract-hero.js`

上述文件在 `_config.yml` 的 `site-css` / `site-js` 中引用，可根据需要增删或修改。

## 其他

- **img/**: 图片资源（头像、文章配图等）
- **data/**: 如 `searchcorpus.json`（站内搜索用）
- **files/**: 其他静态文件（如附件）
