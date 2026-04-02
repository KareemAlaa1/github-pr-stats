import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GitHub PR Stats",
    template: "%s | GitHub PR Stats",
  },
  description:
    "Generate embeddable pull request cards for your GitHub README. Show merged PRs, PR links, titles, status, and repo stars/forks.",
  icons: [
    {
      rel: 'icon',
      url: '/assets/images/logo-white.png',
      media: '(prefers-color-scheme: light)',
    },
    {
      rel: 'icon',
      url: '/assets/images/logo-black.png',
      media: '(prefers-color-scheme: dark)',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const saved = localStorage.getItem("ui-theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved === "light" || saved === "dark" ? saved : (systemDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();`,
          }}
        />
      </head>
      <body className="app-body antialiased">{children}</body>
    </html>
  );
}
