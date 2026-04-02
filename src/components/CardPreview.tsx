"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { themes } from "@/lib/themes";

type CardStyle = "detailed" | "compact";

export default function CardPreview() {
  const [username, setUsername] = useState("kareemalaa1");
  const [style, setStyle] = useState<CardStyle>("detailed");
  const [theme, setTheme] = useState("default");
  const [maxPRs, setMaxPRs] = useState("5");
  const [exclude, setExclude] = useState("");
  const [hideBorder, setHideBorder] = useState(false);
  const [hideTitle, setHideTitle] = useState(false);
  const [hideMeta, setHideMeta] = useState(false);
  const [customTitle, setCustomTitle] = useState("");

  const [origin, setOrigin] = useState("https://github-pr-stats.example.com");
  const [embedUrl, setEmbedUrl] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [markdownCode, setMarkdownCode] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const buildEmbedUrl = useCallback(() => {
    if (!username.trim()) return "";

    const params = new URLSearchParams();
    params.set("username", username.trim());
    if (style !== "detailed") params.set("style", style);
    if (theme !== "default") params.set("theme", theme);
    if (maxPRs !== "5") params.set("max_prs", maxPRs);
    if (exclude.trim()) params.set("exclude", exclude.trim());
    if (hideBorder) params.set("hide_border", "true");
    if (hideTitle) params.set("hide_title", "true");
    if (hideMeta) params.set("hide_meta", "true");
    if (customTitle.trim()) params.set("custom_title", customTitle.trim());

    return `${origin}/api/pr-card?${params.toString()}`;
  }, [
    customTitle,
    exclude,
    hideBorder,
    hideMeta,
    hideTitle,
    maxPRs,
    origin,
    style,
    theme,
    username,
  ]);

  useEffect(() => {
    const url = buildEmbedUrl();
    setEmbedUrl(url);

    if (!url) {
      setImgUrl("");
      setMarkdownCode("");
      setHtmlCode("");
      return;
    }

    const sep = url.includes("?") ? "&" : "?";
    setLoading(true);
    setImgUrl(`${url}${sep}cache=${Date.now()}`);
    setMarkdownCode(`[![GitHub PR Card](${url})](${url})`);
    setHtmlCode(`<object type="image/svg+xml" data="${url}" aria-label="GitHub PR Card"></object>`);
  }, [buildEmbedUrl]);

  const copyToClipboard = useCallback((text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1200);
    });
  }, []);

  const themeEntries = useMemo(() => Object.entries(themes), []);

  return (
    <section className="rounded-2xl app-panel p-6 space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="label-text">GitHub Username</label>
            <input
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="kareemalaa1"
            />
          </div>

          <div>
            <label className="label-text">Style</label>
            <div className="flex gap-2">
              {(["detailed", "compact"] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => setStyle(value)}
                  className={`px-4 py-2 rounded-lg border text-sm ${
                    style === value
                      ? "theme-btn-active"
                      : "theme-btn"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text">Max PRs (1-10)</label>
            <input
              className="input-field"
              type="number"
              min="1"
              max="10"
              value={maxPRs}
              onChange={(e) => setMaxPRs(e.target.value)}
            />
          </div>

          <div>
            <label className="label-text">Exclude repos (owner/repo, comma-separated)</label>
            <input
              className="input-field"
              value={exclude}
              onChange={(e) => setExclude(e.target.value)}
              placeholder="owner/repo-one,owner/repo-two"
            />
          </div>

          <div>
            <label className="label-text">Custom title (optional)</label>
            <input
              className="input-field"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="My merged PRs"
            />
          </div>

          <div className="flex items-center gap-5 text-sm" style={{ color: "var(--app-text)" }}>
            <label className="flex items-center gap-2">
              <input className="theme-checkbox" type="checkbox" checked={hideBorder} onChange={(e) => setHideBorder(e.target.checked)} />
              Hide border
            </label>
            <label className="flex items-center gap-2">
              <input className="theme-checkbox" type="checkbox" checked={hideTitle} onChange={(e) => setHideTitle(e.target.checked)} />
              Hide title
            </label>
            <label className="flex items-center gap-2">
              <input className="theme-checkbox" type="checkbox" checked={hideMeta} onChange={(e) => setHideMeta(e.target.checked)} />
              Hide subtitle
            </label>
          </div>

          <div>
            <label className="label-text">Theme</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {themeEntries.map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`rounded-lg border p-2 text-left ${
                    theme === key ? "theme-btn-active" : "theme-btn"
                  }`}
                  style={{ background: value.bg }}
                >
                  <div style={{ color: value.title }} className="text-xs font-semibold">
                    {value.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl app-panel-soft p-4 min-h-[180px] flex items-center justify-center">
            {imgUrl ? (
              <object
                data={imgUrl}
                type="image/svg+xml"
                className="w-full h-auto min-h-[180px]"
                aria-label="PR card preview"
                onLoad={() => setLoading(false)}
              >
                <a href={embedUrl} target="_blank" rel="noopener noreferrer" className="text-xs app-muted">
                  Open card in new tab
                </a>
              </object>
            ) : (
              <p className="text-sm app-muted">Enter a username to preview your card</p>
            )}
          </div>

          {loading && <p className="text-xs app-muted">Refreshing preview…</p>}

          <div className="rounded-xl app-panel-soft p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs app-muted uppercase">Embed URL</p>
              <button className="copy-btn" onClick={() => copyToClipboard(embedUrl, "url")}>
                {copiedField === "url" ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-xs break-all" style={{ color: "var(--app-text)" }}>{embedUrl || "-"}</p>
          </div>

          <div className="rounded-xl app-panel-soft p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs app-muted uppercase">Markdown</p>
              <button className="copy-btn" onClick={() => copyToClipboard(markdownCode, "md")}>
                {copiedField === "md" ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-xs break-all" style={{ color: "var(--app-text)" }}>{markdownCode || "-"}</p>
          </div>

          <div className="rounded-xl app-panel-soft p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs app-muted uppercase">HTML</p>
              <button className="copy-btn" onClick={() => copyToClipboard(htmlCode, "html")}>
                {copiedField === "html" ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-xs break-all" style={{ color: "var(--app-text)" }}>{htmlCode || "-"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
