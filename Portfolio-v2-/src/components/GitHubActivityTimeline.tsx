"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  GitCommitHorizontal,
  GitPullRequest,
  FolderPlus,
} from "lucide-react";

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

type ActivityResponse = {
  events?: ActivityItem[];
  error?: string;
};

type RepositoryContribution = {
  repository: string;
  repositoryUrl: string;
  date: string;
  commitCount?: number;
  language?: string | null;
};

type ActivityGroup =
  | {
      id: string;
      type: "push";
      date: string;
      repositories: RepositoryContribution[];
      totalCommits?: number;
    }
  | {
      id: string;
      type: "repository";
      date: string;
      repositories: RepositoryContribution[];
    }
  | {
      id: string;
      type: "pull_request";
      date: string;
      pullRequest: ActivityItem;
    };

type MonthActivity = {
  key: string;
  label: string;
  groups: ActivityGroup[];
};

function formatMonth(date: string) {
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(date));
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(date));
}

function isActivityItem(value: unknown): value is ActivityItem {
  if (typeof value !== "object" || value === null) return false;
  const event = value as Partial<ActivityItem>;
  return (
    typeof event.id === "string" &&
    (event.type === "push" || event.type === "repository" || event.type === "pull_request") &&
    typeof event.date === "string" &&
    typeof event.repository === "string" &&
    typeof event.repositoryUrl === "string"
  );
}

export function GitHubActivityTimeline({ active }: { active: boolean }) {
  const [events, setEvents] = useState<ActivityItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "loaded" | "error">("idle");
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!active || requestedRef.current) return;
    requestedRef.current = true;

    const fetchActivity = async () => {
      setStatus("loading");
      try {
        const response = await fetch("/api/github/activity");
        const data = (await response.json()) as ActivityResponse;
        if (!response.ok) {
          throw new Error(data.error ?? `GitHub activity request failed (${response.status}).`);
        }
        if (!Array.isArray(data.events) || !data.events.every(isActivityItem)) {
          throw new Error("GitHub activity returned an invalid response.");
        }
        setEvents(data.events);
        setStatus("loaded");
      } catch (requestError) {
        console.error("Failed to fetch GitHub activity:", requestError);
        setStatus("error");
      }
    };

    void fetchActivity();
  }, [active]);

  const monthlyEvents = useMemo<MonthActivity[]>(() => {
    const months = new Map<string, {
      pushes: Map<string, RepositoryContribution>;
      repositories: Map<string, RepositoryContribution>;
      pullRequests: ActivityItem[];
    }>();

    for (const event of events) {
      const monthKey = event.date.slice(0, 7);
      let month = months.get(monthKey);
      if (!month) {
        month = { pushes: new Map(), repositories: new Map(), pullRequests: [] };
        months.set(monthKey, month);
      }

      if (event.type === "push") {
        const previous = month.pushes.get(event.repository);
        month.pushes.set(event.repository, {
          repository: event.repository,
          repositoryUrl: event.repositoryUrl,
          date: previous && previous.date > event.date ? previous.date : event.date,
          commitCount: previous
            ? previous.commitCount !== undefined && event.commitCount !== undefined
              ? previous.commitCount + event.commitCount
              : undefined
            : event.commitCount,
        });
      } else if (event.type === "repository") {
        const previous = month.repositories.get(event.repository);
        month.repositories.set(event.repository, {
          repository: event.repository,
          repositoryUrl: event.repositoryUrl,
          date: previous && previous.date > event.date ? previous.date : event.date,
          language: event.language ?? previous?.language ?? null,
        });
      } else {
        month.pullRequests.push(event);
      }
    }

    return [...months.entries()]
      .sort(([first], [second]) => second.localeCompare(first))
      .map(([key, month]) => {
        const pushRepositories = [...month.pushes.values()]
          .sort((first, second) => (second.commitCount ?? 0) - (first.commitCount ?? 0));
        const groups: ActivityGroup[] = [];

        if (pushRepositories.length > 0) {
          const knownCommitCounts = pushRepositories.every((repository) => repository.commitCount !== undefined);
          groups.push({
            id: `pushes-${key}`,
            type: "push",
            date: pushRepositories.reduce(
              (latest, repository) => repository.date > latest ? repository.date : latest,
              pushRepositories[0].date,
            ),
            repositories: pushRepositories,
            ...(knownCommitCounts
              ? { totalCommits: pushRepositories.reduce((total, repository) => total + (repository.commitCount ?? 0), 0) }
              : {}),
          });
        }

        const createdRepositories = [...month.repositories.values()]
          .sort((first, second) => second.date.localeCompare(first.date));
        if (createdRepositories.length > 0) {
          groups.push({
            id: `repositories-${key}`,
            type: "repository",
            date: createdRepositories[0].date,
            repositories: createdRepositories,
          });
        }

        for (const pullRequest of month.pullRequests) {
          groups.push({
            id: pullRequest.id,
            type: "pull_request",
            date: pullRequest.date,
            pullRequest,
          });
        }

        groups.sort((first, second) => second.date.localeCompare(first.date));
        return { key, label: formatMonth(`${key}-01T00:00:00`), groups };
      });
  }, [events]);

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex flex-col" aria-label="Loading GitHub activity">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 border-b border-black/10 py-5 dark:border-white/[0.12]">
            <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3.5 w-3/4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/60" />
          </div>
        ))}
      </div>
    );
  }

  if (status === "error") {
    return <p className="py-5 text-center text-[13px] text-zinc-500">GitHub activity is temporarily unavailable. Please try again later.</p>;
  }

  if (events.length === 0) {
    return <p className="py-5 text-center text-[13px] text-zinc-500">No recent public GitHub activity found.</p>;
  }

  return (
    <div className="flex flex-col">
      <p className="pb-2 pt-3 text-[11px] text-zinc-500">Recent public activity from GitHub (up to 90 days).</p>
      {monthlyEvents.map((month) => (
        <section key={month.key} className="relative">
          <h3 className="border-b border-black/10 py-3 text-[13px] font-semibold text-zinc-700 dark:border-white/[0.12] dark:text-zinc-300">
            {month.label}
          </h3>
          <div className="relative">
            <div className="absolute bottom-5 left-[14px] top-5 w-px bg-zinc-200 dark:bg-zinc-800" />
            {month.groups.map((group, index) => {
              const isLast = index === month.groups.length - 1;
              const Icon = group.type === "push"
                ? GitCommitHorizontal
                : group.type === "repository"
                  ? FolderPlus
                  : GitPullRequest;

              return (
                <article key={group.id} className="relative flex gap-3 py-3.5">
                  <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 dark:border-zinc-800 dark:bg-[#09090b] dark:text-zinc-400">
                    <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                  </div>
                  <div className={`min-w-0 flex-1 ${isLast ? "" : "border-b border-black/10 pb-4 dark:border-white/[0.12]"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="min-w-0 text-[13px] font-semibold leading-5 text-zinc-800 dark:text-zinc-200">
                        {group.type === "push"
                          ? group.totalCommits !== undefined
                            ? `Created ${group.totalCommits} ${group.totalCommits === 1 ? "commit" : "commits"} in ${group.repositories.length} ${group.repositories.length === 1 ? "repository" : "repositories"}`
                            : group.repositories.some((repository) => repository.commitCount !== undefined)
                              ? `Verified ${group.repositories.reduce((total, repository) => total + (repository.commitCount ?? 0), 0)} commits across ${group.repositories.filter((repository) => repository.commitCount !== undefined).length} of ${group.repositories.length} repositories`
                              : `Pushed to ${group.repositories.length} ${group.repositories.length === 1 ? "repository" : "repositories"}`
                          : group.type === "repository"
                            ? `Created ${group.repositories.length} ${group.repositories.length === 1 ? "repository" : "repositories"}`
                            : `Pull request in ${group.pullRequest.repository}`}
                      </h4>
                      <time className="shrink-0 pt-0.5 text-[11px] text-zinc-500" dateTime={group.date}>
                        {formatDate(group.date)}
                      </time>
                    </div>

                    {group.type === "push" && (
                      <div className="mt-2 space-y-2.5">
                        {group.repositories.map((repository) => {
                          const maxCount = Math.max(...group.repositories.map((item) => item.commitCount ?? 0), 1);
                          const barWidth = repository.commitCount === undefined
                            ? 0
                            : Math.max(8, Math.round((repository.commitCount / maxCount) * 100));

                          return (
                            <div key={repository.repository} className="grid grid-cols-[minmax(0,1fr)_minmax(90px,34%)] items-center gap-3">
                              <a
                                className="min-w-0 truncate text-[12px] text-sky-700 underline decoration-sky-700/40 underline-offset-2 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300"
                                href={repository.repositoryUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {repository.repository}
                              </a>
                              <div className="flex items-center gap-2">
                                <span className="w-16 shrink-0 text-right text-[11px] text-zinc-500">
                                  {repository.commitCount !== undefined
                                    ? `${repository.commitCount} ${repository.commitCount === 1 ? "commit" : "commits"}`
                                    : "push"}
                                </span>
                                {repository.commitCount !== undefined && (
                                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                    <span className="block h-full rounded-full bg-emerald-500/80 dark:bg-emerald-400/90" style={{ width: `${barWidth}%` }} />
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {group.type === "repository" && (
                      <div className="mt-2 space-y-2">
                        {group.repositories.map((repository) => (
                          <div key={repository.repository} className="grid grid-cols-[minmax(0,1fr)_minmax(0,auto)_auto] items-center gap-3">
                            <a
                              className="min-w-0 truncate text-[12px] text-sky-700 underline decoration-sky-700/40 underline-offset-2 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300"
                              href={repository.repositoryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {repository.repository}
                            </a>
                            <span className="truncate text-[11px] text-zinc-500">{repository.language ?? ""}</span>
                            <time className="text-right text-[11px] text-zinc-500" dateTime={repository.date}>{formatDate(repository.date)}</time>
                          </div>
                        ))}
                      </div>
                    )}

                    {group.type === "pull_request" && (
                      <div className="mt-1.5 text-[12px] leading-5">
                        <a
                          className="font-medium text-sky-700 underline decoration-sky-700/40 underline-offset-2 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300"
                          href={group.pullRequest.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {group.pullRequest.title} #{group.pullRequest.number}
                        </a>
                        {group.pullRequest.status && (
                          <span className="ml-2 text-[11px] capitalize text-zinc-500">
                            {group.pullRequest.status.toLowerCase()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
