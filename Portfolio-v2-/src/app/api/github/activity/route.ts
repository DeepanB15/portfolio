import { NextResponse } from "next/server";

export const revalidate = 600;
export const dynamic = "force-dynamic";

type GitHubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    action?: string;
    size?: number;
    commits?: unknown[];
    before?: string;
    head?: string;
    ref_type?: string;
    pull_request?: {
      html_url?: string;
      title?: string;
      number?: number;
      state?: string;
      merged_at?: string | null;
    };
    review?: { state?: string };
  };
};

type ActivityItem = {
  id: string;
  type: "push" | "repository" | "pull_request";
  date: string;
  repository: string;
  repositoryUrl: string;
  title?: string;
  url?: string;
  number?: number;
  status?: string;
  language?: string | null;
  commitCount?: number;
};

function isGitHubEvent(value: unknown): value is GitHubEvent {
  if (typeof value !== "object" || value === null) return false;
  const event = value as Partial<GitHubEvent>;
  return (
    typeof event.id === "string" &&
    typeof event.type === "string" &&
    typeof event.created_at === "string" &&
    typeof event.repo?.name === "string" &&
    typeof event.payload === "object" &&
    event.payload !== null
  );
}

function githubHeaders(token?: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "DeepanB15-portfolio",
    ...(token ? { Authorization: "Bearer " + token } : {}),
  };
}

async function fetchGitHubEvents(token?: string): Promise<GitHubEvent[]> {
  const events: GitHubEvent[] = [];

  for (let page = 1; page <= 3; page += 1) {
    const url = new URL("https://api.github.com/users/DeepanB15/events");
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));

    const response = await fetch(url, {
      headers: githubHeaders(token),
      next: { revalidate },
    });

    if (!response.ok) {
      const message = `GitHub activity request failed (${response.status}).`;
      console.error(message, await response.text());
      throw new Error(message);
    }

    const result: unknown = await response.json();
    if (!Array.isArray(result) || !result.every(isGitHubEvent)) {
      throw new Error("GitHub activity returned an invalid response.");
    }
    events.push(...result);
    if (result.length < 100) break;
  }

  return events;
}

async function fetchRepositoryLanguages(token: string | undefined, events: GitHubEvent[]) {
  if (!events.some((event) => event.type === "CreateEvent" && event.payload.ref_type === "repository")) {
    return new Map<string, string | null>();
  }

  const url = new URL("https://api.github.com/users/DeepanB15/repos");
  url.searchParams.set("sort", "created");
  url.searchParams.set("direction", "desc");
  url.searchParams.set("per_page", "100");

  const response = await fetch(url, {
    headers: githubHeaders(token),
    next: { revalidate },
  });
  if (!response.ok) {
    console.warn(`GitHub repository language lookup failed (${response.status}).`);
    return new Map<string, string | null>();
  }

  const result: unknown = await response.json();
  if (!Array.isArray(result)) {
    console.warn("GitHub repository language lookup returned an invalid response.");
    return new Map<string, string | null>();
  }

  return new Map(
    result.flatMap((repo: { full_name?: unknown; language?: unknown }) =>
      typeof repo.full_name === "string"
        ? [[repo.full_name, typeof repo.language === "string" ? repo.language : null] as const]
        : [],
    ),
  );
}

async function fetchPushCommitCounts(token: string | undefined, events: GitHubEvent[]) {
  const pushEvents = events
    .filter((event) =>
      event.type === "PushEvent" &&
      typeof event.payload.size !== "number" &&
      !Array.isArray(event.payload.commits) &&
      typeof event.payload.before === "string" &&
      typeof event.payload.head === "string" &&
      event.payload.before !== "0000000000000000000000000000000000000000",
    )
    .slice(0, 25);

  const results = await Promise.all(pushEvents.map(async (event) => {
    const [owner, repository] = event.repo.name.split("/");
    if (!owner || !repository) return [event.id, undefined] as const;

    const url = new URL(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/compare/${event.payload.before}...${event.payload.head}`,
    );
    url.searchParams.set("per_page", "1");
    try {
      const response = await fetch(url, {
        headers: githubHeaders(token),
        next: { revalidate },
      });
      if (!response.ok) {
        console.warn(`GitHub push comparison failed (${response.status}) for ${event.repo.name}.`);
        return [event.id, undefined] as const;
      }

      const result: unknown = await response.json();
      if (
        typeof result === "object" &&
        result !== null &&
        "total_commits" in result &&
        typeof result.total_commits === "number"
      ) {
        return [event.id, result.total_commits] as const;
      }
    } catch (error) {
      console.warn(`GitHub push comparison failed for ${event.repo.name}.`, error);
    }

    return [event.id, undefined] as const;
  }));

  return new Map(results);
}

function createActivity(
  events: GitHubEvent[],
  languages: Map<string, string | null>,
  pushCommitCounts: Map<string, number | undefined>,
): ActivityItem[] {
  const items = new Map<string, ActivityItem>();

  for (const event of events) {
    const repository = event.repo.name;
    const repositoryUrl = `https://github.com/${repository}`;
    const date = event.created_at;

    if (event.type === "PushEvent") {
      const key = `push:${repository}:${date.slice(0, 10)}`;
      const count = typeof event.payload.size === "number"
        ? event.payload.size
        : Array.isArray(event.payload.commits)
          ? event.payload.commits.length
          : pushCommitCounts.get(event.id);
      const previous = items.get(key);
      if (previous) {
        if (previous.commitCount !== undefined && count !== undefined) {
          previous.commitCount += count;
        } else {
          previous.commitCount = undefined;
        }
        if (new Date(date) > new Date(previous.date)) previous.date = date;
      } else {
        items.set(key, {
          id: key,
          type: "push",
          date,
          repository,
          repositoryUrl,
          ...(count !== undefined ? { commitCount: count } : {}),
        });
      }
      continue;
    }

    if (event.type === "CreateEvent" && event.payload.ref_type === "repository") {
      items.set(`repository:${event.id}`, {
        id: event.id,
        type: "repository",
        date,
        repository,
        repositoryUrl,
        language: languages.get(repository) ?? null,
      });
      continue;
    }

    if (event.type === "PullRequestEvent" || event.type === "PullRequestReviewEvent") {
      const pullRequest = event.payload.pull_request;
      if (!pullRequest?.html_url || !pullRequest.title || !pullRequest.number) continue;

      const action = event.type === "PullRequestReviewEvent"
        ? "reviewed"
        : event.payload.action ?? "updated";
      if (event.type === "PullRequestEvent" && !["opened", "closed", "reopened"].includes(action)) continue;

      items.set(`pull-request:${event.id}`, {
        id: event.id,
        type: "pull_request",
        date,
        repository,
        repositoryUrl,
        title: pullRequest.title,
        url: pullRequest.html_url,
        number: pullRequest.number,
        status: pullRequest.merged_at
          ? "Merged"
          : event.type === "PullRequestReviewEvent"
            ? event.payload.review?.state ?? "Reviewed"
            : pullRequest.state ?? action,
      });
    }
  }

  return [...items.values()].sort((first, second) =>
    new Date(second.date).getTime() - new Date(first.date).getTime(),
  );
}

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;
    const events = await fetchGitHubEvents(token);
    const [languages, pushCommitCounts] = await Promise.all([
      fetchRepositoryLanguages(token, events),
      fetchPushCommitCounts(token, events),
    ]);
    return NextResponse.json({ events: createActivity(events, languages, pushCommitCounts) });
  } catch (error) {
    console.error("GitHub activity request failed.", error);
    return NextResponse.json(
      { error: "GitHub activity is temporarily unavailable." },
      { status: 502 },
    );
  }
}
