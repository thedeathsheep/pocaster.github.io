# Inevitable Event

Personal site for `inevitable-event.com`, built with Jekyll and deployed to Ubuntu + Nginx.

## What lives here

- Blog posts and essays
- Project case studies (Echo, Another History)
- Personal homepage and about page
- Data-driven project index

## Tech stack

- Jekyll + Beautiful Jekyll
- Custom frame-system CSS theme (dark editorial)
- Ubuntu Server + Nginx

## Local development

1. Install Ruby 3.3+ and Bundler.

2. Clone the repository.

```bash
git clone https://github.com/thedeathsheep/pocaster.github.io.git
cd pocaster.github.io
```

3. Install dependencies.

```bash
bundle install
```

4. Start the local server.

```bash
bundle exec jekyll serve
```

5. Open [http://localhost:4000](http://localhost:4000).

## Content structure

- `_posts/`: blog posts
- `_layouts/`, `_includes/`, `_data/`: templates, partials, and structured site data
- `assets/css/ie-theme.css`: frame-system theme (homepage and core visual language)
- `assets/css/unified-theme.css`: editorial theme for non-home pages (posts, projects, about)
- `assets/css/case-study.css`: project case study layouts
- `assets/js/ie-main.js`: navigation and frame animation scripts

## Data files

- `_data/projects.yml` — project list (Echo, Another History)
- `_data/research.yml` — research/prototype items
- `_data/games.yml` — game content (reserved for future use)

## Navigation

The site uses a custom navigation (`_includes/ie-nav.html`) with four sections:

- **Work** (`/`) — homepage with hero + featured frames + recent writing
- **Writing** (`/writing/`) — full article archive, publication-directory style
- **Projects** (`/projects/`) — project index with preview frames
- **About** (`/about/`) — author bio and site philosophy

## Deployment

Common operations are wrapped in one safe PowerShell command:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/site.ps1 status
powershell -ExecutionPolicy Bypass -File scripts/site.ps1 preview
powershell -ExecutionPolicy Bypass -File scripts/site.ps1 check
powershell -ExecutionPolicy Bypass -File scripts/site.ps1 publish
```

`publish` only pushes existing commits from `redesign-frame-system`; it never stages or commits files. Project context lives in `PROJECT.md`, `STYLE.md`, and `CURRENT.md`. Copy `TASK_TEMPLATE.md` to the ignored local `TASK.md` when delegating a narrow task to Cursor or another agent.

1. Build locally:

```bash
bundle exec jekyll build
```

2. Copy `_site/` contents to the server root (e.g. `/var/www/portfolio/`).

3. Verify:

```bash
# Check nginx config
nginx -t

# Reload
systemctl reload nginx

# Verify
curl -sI https://inevitable-event.com
```

### Deployment notes

- Do NOT touch the `echo.inevitable-event.com` or `history.inevitable-event.com` subdirectories.
- Keep a backup of the previous deployment before replacing files:

```bash
cp -r /var/www/portfolio /var/www/portfolio-backup-$(date +%Y%m%d)
```

## Contact

- Email: [helloandone@gmail.com](mailto:helloandone@gmail.com)
- GitHub: [thedeathsheep](https://github.com/thedeathsheep)
