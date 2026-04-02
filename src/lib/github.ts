import { PullRequestItem, PullRequestStats } from "./types";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

const PULL_REQUESTS_QUERY = `
query($username: String!, $limit: Int!) {
  user(login: $username) {
    login
    pullRequests(
      first: $limit
      states: MERGED
      orderBy: { field: UPDATED_AT, direction: DESC }
    ) {
      nodes {
        id
        number
        title
        url
        state
        mergedAt
        repository {
          nameWithOwner
          stargazerCount
          forkCount
          isPrivate
        }
      }
    }
  }
}`;

function normalizePr(node: {
  id: string;
  number: number;
  title: string;
  url: string;
  state: "OPEN" | "MERGED" | "CLOSED";
  mergedAt: string | null;
  repository: {
    nameWithOwner: string;
    stargazerCount: number;
    forkCount: number;
    isPrivate: boolean;
  };
}): PullRequestItem | null {
  if (node.repository.isPrivate) return null;

  const stars = node.repository.stargazerCount ?? 0;
  const forks = node.repository.forkCount ?? 0;
  return {
    id: node.id,
    number: node.number,
    title: node.title,
    url: node.url,
    state: node.state,
    mergedAt: node.mergedAt,
    repository: {
      nameWithOwner: node.repository.nameWithOwner,
      stars,
      forks,
    },
  };
}

export async function fetchPullRequestStats(options: {
  username: string;
  maxPRs: number;
  excludedRepos: Set<string>;
}): Promise<PullRequestStats> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is not set");
  }

  const response = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "github-pr-stats",
    },
    body: JSON.stringify({
      query: PULL_REQUESTS_QUERY,
      variables: { username: options.username, limit: 50 },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GitHub API responded with status ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    const message = json.errors[0]?.message ?? "Unknown GraphQL error";
    throw new Error(message);
  }

  const user = json.data?.user;
  if (!user) {
    throw new Error(`User \"${options.username}\" not found`);
  }

  const normalized = (user.pullRequests.nodes as Array<{
    id: string;
    number: number;
    title: string;
    url: string;
    state: "OPEN" | "MERGED" | "CLOSED";
    mergedAt: string | null;
    repository: {
      nameWithOwner: string;
      stargazerCount: number;
      forkCount: number;
      isPrivate: boolean;
    };
  }>)
    .map(normalizePr)
    .filter((item): item is PullRequestItem => Boolean(item));

  const filtered = normalized
    .filter((item) => !options.excludedRepos.has(item.repository.nameWithOwner.toLowerCase()))
    .slice(0, options.maxPRs);

  return {
    username: user.login,
    totalMergedInWindow: filtered.length,
    excludedRepoCount: options.excludedRepos.size,
    items: filtered,
  };
}
