# Contributing

Thanks for contributing to GitHub PR Stats.

## Project structure

- `src/app/api/pr-card/route.ts` — API endpoint and query parsing
- `src/lib/github.ts` — GitHub GraphQL fetch + PR filtering
- `src/lib/svg.ts` — SVG renderers
- `src/lib/themes.ts` — theme registry and overrides
- `src/lib/sanitize.ts` — validation/sanitization helpers
- `src/components/CardPreview.tsx` — builder UI

## Contribution rules

1. Keep endpoint parameters backward compatible.
2. Add new query params with sane defaults and strict bounds.
3. Keep `README.md` in sync with new options.

## Development

```bash
npm install
npm run dev
```
