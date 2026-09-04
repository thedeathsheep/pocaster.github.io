# Inevitable Event

## Purpose

Inevitable Event is a public working index of product cases, experiments, and writing. It is an editorial research archive rather than a conventional SaaS portfolio.

## Repository

- Stack: Jekyll, Liquid, Markdown, CSS, JavaScript.
- Repository: `https://github.com/thedeathsheep/pocaster.github.io`.
- Production branch: `redesign-frame-system`.
- Production URL: `https://inevitable-event.com`.
- Production directory: `/var/www/portfolio` on `139.155.139.62`.
- Deployment: GitHub Actions workflow `.github/workflows/deploy-farawayfromicu.yml`.

## Information architecture

- Product cases: research, decisions, prototypes, and validation evidence.
- Experiments: independent working products and interaction studies.
- Writing: essays on AI products, creative tools, games, and narrative systems.

Key pages:

- `index.html`: home and selected work.
- `projects/index.md`: public project index.
- `projects/infinite-canvas.md`: Infinite Canvas case.
- `projects/3d-directors-desk.md`: 3D Director's Desk case.
- `writing.md`: writing archive.
- `about.md`: profile and contact information.

## Related deployments

These applications share the server but are separate projects:

| Domain | Server directory | Scope |
| --- | --- | --- |
| `inevitable-event.com` | `/var/www/portfolio` | This repository |
| `echo.inevitable-event.com` | `/var/www/echo` | Echo application |
| `history.inevitable-event.com` | `/var/www/anotherhistory` | Another History application |

Never overwrite `/var/www/echo` or `/var/www/anotherhistory` while deploying this repository.

## Public evidence boundary

Internal Feishu documents, customer information, credentials, private URLs, and raw company material must not be committed or published. Public cases may contain only rewritten conclusions, publishable screenshots, and original diagrams.

