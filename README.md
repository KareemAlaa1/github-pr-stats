# GitHub PR Stats

Embeddable GitHub pull-request cards for README files.

This project generates SVG cards that show:
- merged PR title + link
- PR number and status
- repository name
- repository stars/forks

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Configure env:

```bash
cp .env.example .env.local
```

Set `GITHUB_TOKEN` in `.env.local`.

3. Run:

```bash
npm run dev
```

## API

### `GET /api/pr-card`

Required:
- `username` — GitHub username

Optional:
- `style` — `detailed` (default) or `compact`
- `max_prs` — number of PR rows (1–10, default 5)
- `exclude` — comma-separated exact repo list (`owner/repo`)
- `theme` — one of the built-in themes (`default`, `light`, `radical`, `tokyonight`, `dracula`, `catppuccin`, `forest`)
- `hide_border` — `true|false`
- `hide_title` — `true|false`
- `border_radius` — 0–50
- `custom_title` — override title text

Example:

```md
![GitHub PR Card](https://github-pr-stats-three.vercel.app/api/pr-card?username=kareemalaa1)
```

![GitHub PR Card](https://github-pr-stats-three.vercel.app/api/pr-card?username=kareemalaa1)

## Contributing

We welcome contributions! To help improve this project, please check out [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines

