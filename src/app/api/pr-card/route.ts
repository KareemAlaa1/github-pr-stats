import { NextRequest } from "next/server";
import { fetchPullRequestStats } from "@/lib/github";
import { renderErrorCard, renderPrCard } from "@/lib/svg";
import { resolveTheme } from "@/lib/themes";
import {
  clampInteger,
  parseExcludeList,
  sanitizeHexParam,
  sanitizeUsername,
} from "@/lib/sanitize";
import { PrCardStyle } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const rawUsername = params.get("username") ?? "";
  const username = sanitizeUsername(rawUsername);

  const themeName = params.get("theme") ?? "default";
  const theme = resolveTheme(themeName, {
    bg: sanitizeHexParam(params.get("bg")),
    text: sanitizeHexParam(params.get("text")),
    title_color: sanitizeHexParam(params.get("title_color")),
    icon_color: sanitizeHexParam(params.get("icon_color")),
    border_color: sanitizeHexParam(params.get("border_color")),
  });

  const styleParam = params.get("style");
  const style: PrCardStyle = styleParam === "compact" ? "compact" : "detailed";
  const maxPRs = clampInteger(params.get("max_prs"), 1, 10, 5);

  const options = {
    style,
    hide_border: params.get("hide_border") === "true",
    hide_title: params.get("hide_title") === "true",
    hide_meta: params.get("hide_meta") === "true",
    border_radius: Math.min(
      Math.max(parseFloat(params.get("border_radius") ?? "8") || 8, 0),
      50,
    ),
    custom_title: params.get("custom_title") ?? undefined,
  };

  const headers = {
    "Content-Type": "image/svg+xml",
    "Cache-Control":
      "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
  };

  if (!username) {
    return new Response(
      renderErrorCard('Missing or invalid "username" parameter.', theme),
      { status: 400, headers },
    );
  }

  try {
    const stats = await fetchPullRequestStats({
      username,
      maxPRs,
      excludedRepos: parseExcludeList(params.get("exclude")),
    });

    return new Response(renderPrCard(stats, theme, options), {
      status: 200,
      headers,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    return new Response(renderErrorCard(message, theme), {
      status: 500,
      headers,
    });
  }
}
