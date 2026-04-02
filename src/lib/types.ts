export interface ThemeConfig {
  name: string;
  bg: string;
  text: string;
  title: string;
  icon: string;
  border: string;
}

export type PrState = "OPEN" | "MERGED" | "CLOSED";

export interface RepoMetrics {
  nameWithOwner: string;
  stars: number;
  forks: number;
}

export interface PullRequestItem {
  id: string;
  number: number;
  title: string;
  url: string;
  state: PrState;
  mergedAt: string | null;
  repository: RepoMetrics;
}

export interface PullRequestStats {
  username: string;
  totalMergedInWindow: number;
  excludedRepoCount: number;
  items: PullRequestItem[];
}

export type PrCardStyle = "detailed" | "compact";

export interface PrCardOptions {
  style: PrCardStyle;
  hide_border: boolean;
  hide_title: boolean;
  hide_meta: boolean;
  border_radius: number;
  custom_title?: string;
}
