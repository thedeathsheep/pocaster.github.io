# POCASTER'S BLOG

Personal site and blog for `farawayfrom.icu`, built with Jekyll and deployed to a Windows Server + IIS environment.

## What lives here

- Blog posts and essays
- A personal homepage and about page
- Data-driven indexes for games and projects
- Deployment automation for the live server

## Tech stack

- Jekyll
- Beautiful Jekyll
- GitHub Actions
- Windows Server + IIS

## Local development

1. Install Ruby and Bundler.
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
- `assets/`: styles, scripts, and images
- `scripts/`: deployment or build-related helper scripts
- `_config.yml`: site configuration

## Updating games and projects

The site now uses data files for the main indexes:

- `_data/games.yml`
- `_data/projects.yml`

To add a new item, append a new YAML object with the right fields.

### Game fields

- `title`
- `slug`
- `status`
- `summary`
- `platform`
- `stack`
- `url`
- `cta_label`

### Project fields

- `title`
- `kind`
- `status`
- `summary`
- `stack`
- `url`
- `cta_label`

These data files feed both the dedicated index pages and the featured work section on the homepage.

## Contact

- Email: [helloandone@gmail.com](mailto:helloandone@gmail.com)
- GitHub: [thedeathsheep](https://github.com/thedeathsheep)

## Deployment

Production deployment is handled by `.github/workflows/deploy-farawayfromicu.yml`.

- Target directory: `C:\inetpub\wwwroot\farawayfromicu`
- Backup directory: `C:\inetpub\wwwroot\_deploy_backups\farawayfromicu-<timestamp>`
- Required GitHub Secrets:
  - `FARAWAY_SSH_HOST`
  - `FARAWAY_SSH_USER`
  - `FARAWAY_SSH_KEY`

The server should have OpenSSH enabled, IIS pointed at the target directory, and the deployment account should have permission to back up and replace site files.

## License

MIT. See [LICENSE](LICENSE).
