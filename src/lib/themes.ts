import { ThemeConfig } from "./types";

export const themes: Record<string, ThemeConfig> = {
  default: {
    name: "Night Harbor",
    bg: "#111827",
    text: "#cbd5e1",
    title: "#7dd3fc",
    icon: "#93c5fd",
    border: "#334155",
  },
  light: {
    name: "Paper Cloud",
    bg: "#f8fafc",
    text: "#334155",
    title: "#2563eb",
    icon: "#0284c7",
    border: "#cbd5e1",
  },
  radical: {
    name: "Rose Dusk",
    bg: "#1f172a",
    text: "#e9d5ff",
    title: "#f472b6",
    icon: "#fb7185",
    border: "#7e22ce",
  },
  tokyonight: {
    name: "Blue Hour",
    bg: "#1e293b",
    text: "#bfdbfe",
    title: "#a5b4fc",
    icon: "#67e8f9",
    border: "#475569",
  },
  dracula: {
    name: "Velvet Plum",
    bg: "#2a1f3d",
    text: "#efe7ff",
    title: "#c4b5fd",
    icon: "#f9a8d4",
    border: "#6d5b95",
  },
  catppuccin: {
    name: "Lavender Latte",
    bg: "#24273a",
    text: "#cad3f5",
    title: "#b7bdf8",
    icon: "#f5bde6",
    border: "#494d64",
  },
  forest: {
    name: "Moss Garden",
    bg: "#10231a",
    text: "#cde7d8",
    title: "#6ee7b7",
    icon: "#86efac",
    border: "#2f4f3e",
  },
  dawnmist: {
    name: "Dawn Mist",
    bg: "#1f2937",
    text: "#d1d5db",
    title: "#f9a8d4",
    icon: "#93c5fd",
    border: "#4b5563",
  },
  softsand: {
    name: "Soft Sand",
    bg: "#2b2620",
    text: "#e7dcc9",
    title: "#fbbf24",
    icon: "#f59e0b",
    border: "#57534e",
  },
  mintnight: {
    name: "Mint Night",
    bg: "#0f1f24",
    text: "#c7e9e1",
    title: "#5eead4",
    icon: "#2dd4bf",
    border: "#2f4f56",
  },
};

export function resolveTheme(
  themeName: string,
  overrides: {
    bg?: string;
    text?: string;
    title_color?: string;
    icon_color?: string;
    border_color?: string;
  },
): ThemeConfig {
  const base = themes[themeName] ?? themes.default;
  return {
    ...base,
    bg: overrides.bg ? `#${overrides.bg}` : base.bg,
    text: overrides.text ? `#${overrides.text}` : base.text,
    title: overrides.title_color ? `#${overrides.title_color}` : base.title,
    icon: overrides.icon_color ? `#${overrides.icon_color}` : base.icon,
    border: overrides.border_color ? `#${overrides.border_color}` : base.border,
  };
}
