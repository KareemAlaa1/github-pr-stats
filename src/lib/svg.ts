import { PrCardOptions, PullRequestStats, ThemeConfig } from "./types";
import { escapeXml, truncate } from "./sanitize";

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

function getCardHeight(style: PrCardOptions["style"], itemCount: number): number {
  const header = 78;
  const rowHeight = style === "compact" ? 36 : 54;
  const footer = 18;
  return header + itemCount * rowHeight + footer;
}

function renderDetailedRows(stats: PullRequestStats, theme: ThemeConfig): string {
  return stats.items
    .map((item, index) => {
      const y = 96 + index * 54;
      const title = escapeXml(truncate(item.title, 62));
      const repo = escapeXml(item.repository.nameWithOwner);
      const lineColor = theme.border;

      return `
      <g>
        <line x1="20" y1="${y - 18}" x2="780" y2="${y - 18}" stroke="${lineColor}" stroke-opacity="0.35" />
        <a href="${escapeXml(item.url)}" xlink:href="${escapeXml(item.url)}" target="_blank" rel="noopener noreferrer">
          <text x="24" y="${y}" fill="${theme.title}" font-size="14" font-weight="700">#${item.number} ${title}</text>
        </a>
        <text x="24" y="${y + 19}" fill="${theme.text}" font-size="12">${repo}</text>
        <text x="450" y="${y + 19}" fill="${theme.text}" font-size="12">★ ${formatNumber(item.repository.stars)}  •  ⑂ ${formatNumber(item.repository.forks)}</text>
      </g>`;
    })
    .join("\n");
}

function renderCompactRows(stats: PullRequestStats, theme: ThemeConfig): string {
  return stats.items
    .map((item, index) => {
      const y = 96 + index * 36;
      const title = escapeXml(truncate(item.title, 48));
      const repo = escapeXml(item.repository.nameWithOwner);

      return `
      <g>
        <line x1="20" y1="${y - 16}" x2="780" y2="${y - 16}" stroke="${theme.border}" stroke-opacity="0.3" />
        <a href="${escapeXml(item.url)}" xlink:href="${escapeXml(item.url)}" target="_blank" rel="noopener noreferrer">
          <text x="24" y="${y}" fill="${theme.title}" font-size="13" font-weight="700">#${item.number} ${title}</text>
        </a>
        <text x="530" y="${y}" fill="${theme.text}" font-size="11">${repo}</text>
        <text x="700" y="${y}" fill="${theme.icon}" font-size="11" font-weight="700">★${formatNumber(item.repository.stars)} ⑂${formatNumber(item.repository.forks)}</text>
      </g>`;
    })
    .join("\n");
}

export function renderPrCard(
  stats: PullRequestStats,
  theme: ThemeConfig,
  options: PrCardOptions,
): string {
  const width = 800;
  const cardHeight = getCardHeight(options.style, Math.max(stats.items.length, 1));
  const title = options.custom_title
    ? escapeXml(options.custom_title)
    : `${escapeXml(stats.username)}'s Merged Pull Requests`;

  const rows = stats.items.length
    ? options.style === "compact"
      ? renderCompactRows(stats, theme)
      : renderDetailedRows(stats, theme)
    : `<text x="24" y="114" fill="${theme.text}" font-size="13">No merged pull requests found for the selected filters.</text>`;

  return `
<svg width="${width}" height="${cardHeight}" viewBox="0 0 ${width} ${cardHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="Pull request stats card">
  <style>
    .subtitle { font-family: 'Segoe UI', Ubuntu, sans-serif; font-size: 12px; fill: ${theme.text}; }
    text { font-family: 'Segoe UI', Ubuntu, sans-serif; }
    a:hover text { text-decoration: underline; }
  </style>
  <rect x="1" y="1" width="${width - 2}" height="${cardHeight - 2}" rx="${options.border_radius}" fill="${theme.bg}" ${
    options.hide_border ? "" : `stroke=\"${theme.border}\"`
  } />

  ${
    options.hide_title
      ? ""
      : `<text x="24" y="36" fill="${theme.title}" font-size="20" font-weight="800">${title}</text>`
  }
  ${
    options.hide_meta
      ? ""
      : `<text x="24" y="60" class="subtitle">Latest merged PRs • shown: ${stats.totalMergedInWindow} • excluded repos: ${stats.excludedRepoCount}</text>`
  }

  ${rows}
</svg>`;
}

export function renderErrorCard(message: string, theme: ThemeConfig): string {
  const safe = escapeXml(message);
  return `
<svg width="800" height="140" viewBox="0 0 800 140" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Error card">
  <rect x="1" y="1" width="798" height="138" rx="10" fill="${theme.bg}" stroke="${theme.border}" />
  <text x="24" y="44" fill="${theme.title}" font-size="20" font-weight="800" font-family="Segoe UI, Ubuntu, sans-serif">GitHub PR Stats</text>
  <text x="24" y="78" fill="${theme.text}" font-size="13" font-family="Segoe UI, Ubuntu, sans-serif">${safe}</text>
  <text x="24" y="104" fill="${theme.text}" font-size="12" opacity="0.8" font-family="Segoe UI, Ubuntu, sans-serif">Example: /api/pr-card?username=kareemalaa1&style=detailed</text>
</svg>`;
}
