"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface AppHeaderProps {
  repoUrl: string;
}

type UiTheme = "dark" | "light";

export default function AppHeader({ repoUrl }: AppHeaderProps) {
  const [theme, setTheme] = useState<UiTheme>("dark");
  const [logoSrc, setLogoSrc] = useState("/assets/images/logo-white.png");

  useEffect(() => {
    const current = (document.documentElement.getAttribute("data-theme") as UiTheme | null) ?? "dark";
    setTheme(current);
  }, []);

  useEffect(() => {
    setLogoSrc(theme === "dark" ? "/assets/images/logo-white.png" : "/assets/images/logo-black.png");
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: UiTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("ui-theme", nextTheme);
    setTheme(nextTheme);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src={logoSrc}
            alt="GitHub PR Stats logo"
            width={46}
            height={46}
            className="rounded-lg"
            priority
            onError={() => setLogoSrc("/assets/images/icon.png")}
          />
          <h1 className="text-3xl md:text-4xl font-extrabold app-title">
            GitHub PR Stats Cards
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold app-panel app-title"
            aria-label="Toggle light and dark mode"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>

          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold app-panel app-title"
          >
            ⭐ Give a star on GitHub
          </a>
        </div>
      </div>

      <p className="max-w-3xl app-muted">
        Generate embeddable pull request cards for your README. Show merged PR
        titles, links, status, repository name, and repository signals (stars
        and forks).
      </p>
    </section>
  );
}
