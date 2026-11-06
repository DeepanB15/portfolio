"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GitHubActivityTimeline } from "@/components/GitHubActivityTimeline";
import {
  pipeshubContributions,
  pipeshubTechnicalDetails,
} from "@/data/pipeshub-contributions";

interface PR {
  id: number;
  title: string;
  url: string;
  repository: { nameWithOwner: string };
  state: string;
  createdAt: string;
  mergedAt?: string | null;
  number?: number;
  mergedDate?: string;
  technicalDetails?: readonly string[];
}

type SearchEdge = { node: PR };
type GitHubSearchResponse = {
  data?: {
    search?: {
      edges?: Array<SearchEdge | null>;
      pageInfo?: { hasNextPage: boolean };
    };
  };
  message?: string;
  error?: unknown;
};
type FilterType = "merged" | "activity";

const MAX_MERGED_PRS = 300;
const PR_CACHE_KEY = "github_prs_v5_300_DeepanB15";

const pipeshubPRs: PR[] = pipeshubContributions.map((contribution) => ({
  id: -contribution.number,
  title: contribution.title,
  url: contribution.url,
  repository: { nameWithOwner: "pipeshub-ai/pipeshub-ai" },
  state: "MERGED",
  createdAt: contribution.mergedAt,
  mergedAt: contribution.mergedAt,
  number: contribution.number,
  mergedDate: contribution.mergedDate,
  technicalDetails: pipeshubTechnicalDetails,
}));

function includePipesHubPRs(prs: PR[]) {
  const actualByUrl = new Map(prs.map((pr) => [pr.url, pr]));
  const confirmedUrls = new Set(pipeshubPRs.map((pr) => pr.url));
  return [
    ...pipeshubPRs.map((confirmedPR) => {
      const actualPR = actualByUrl.get(confirmedPR.url);
      return actualPR
        ? { ...actualPR, technicalDetails: pipeshubTechnicalDetails }
        : confirmedPR;
    }),
    ...prs.filter((pr) => !confirmedUrls.has(pr.url)),
  ];
}

export function OpenSourceContributions({ isFullPage = false }: { isFullPage?: boolean }) {
  const [mergedPRs, setMergedPRs] = useState<PR[]>(pipeshubPRs);
  const [mergedLoaded, setMergedLoaded] = useState(false);
  const [mergedError, setMergedError] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>("merged");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const fetchedRef = useRef(false);
  const initialCount = 4;

  const fetchMergedPRs = useCallback(async () => {
    const cachedData = typeof window !== "undefined" ? localStorage.getItem(PR_CACHE_KEY) : null;
    if (cachedData) {
      try {
        const parsed: unknown = JSON.parse(cachedData);
        if (Array.isArray(parsed)) {
          setMergedPRs(includePipesHubPRs(parsed as PR[]));
        }
      } catch {
        localStorage.removeItem(PR_CACHE_KEY);
      }
    }

    try {
      const fetchedEdges: Array<SearchEdge | null> = [];
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage && fetchedEdges.length < MAX_MERGED_PRS) {
        const response = await fetch(`/api/github?state=merged&page=${page}`);
        const data = (await response.json()) as GitHubSearchResponse;
        if (!response.ok) {
          throw new Error(data.message ?? data.error?.toString() ?? `Pull request request failed (${response.status}).`);
        }
        const search = data.data?.search;
        if (!search?.edges) throw new Error("GitHub returned an invalid pull request response.");

        fetchedEdges.push(...search.edges.slice(0, MAX_MERGED_PRS - fetchedEdges.length));
        hasNextPage = Boolean(search.pageInfo?.hasNextPage);
        page += 1;
      }

      const fetchedPRs = fetchedEdges.flatMap((edge) => edge?.node ? [edge.node] : []);
      fetchedPRs.sort((first, second) =>
        new Date(second.mergedAt ?? second.createdAt).getTime() -
        new Date(first.mergedAt ?? first.createdAt).getTime(),
      );
      const displayedPRs = includePipesHubPRs(fetchedPRs);
      setMergedPRs(displayedPRs);
      localStorage.setItem(PR_CACHE_KEY, JSON.stringify(displayedPRs));
    } catch (error) {
      console.error("Failed to fetch merged GitHub pull requests:", error);
      setMergedError(true);
    } finally {
      setMergedLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    void fetchMergedPRs();
  }, [fetchMergedPRs]);

  const handleFilterChange = useCallback((type: FilterType) => {
    if (type === filterType) return;
    setIsTransitioning(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        setFilterType(type);
        requestAnimationFrame(() => {
          setTimeout(() => setIsTransitioning(false), 30);
        });
      }, 120);
    });
  }, [filterType]);

  return (
    <div className="w-full flex flex-col">
      <div className="py-2 relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Open Source Contributions</h2>

        <div className="flex items-center gap-2 relative z-20 group mr-[8px]">
          <div className="absolute -inset-[5px] border border-black/5 dark:border-white/5 rounded-[11px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
          <div className="relative grid grid-cols-2 p-1 bg-zinc-50 dark:bg-[#09090b] rounded-[6px] border border-black/5 dark:border-white/5 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80 w-fit select-none">
            <div
              className={`absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/2)] rounded-[4px] bg-white dark:bg-[#1e1e20] border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] transform will-change-transform ${filterType === "merged" ? "translate-x-0" : "translate-x-[100%]"}`}
            />
            {(["merged", "activity"] as FilterType[]).map((type) => (
              <button
                key={type}
                type="button"
                role="tab"
                aria-selected={filterType === type}
                onClick={() => handleFilterChange(type)}
                className={`z-10 relative px-3 py-1.5 text-[12px] font-medium text-center transition-colors duration-200 capitalize ${filterType === type
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
        <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/40 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/40 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
      </div>

      <div className="relative pt-0 pb-2">
        <div
          className="transition-all duration-150 ease-out"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? "translateY(4px)" : "translateY(0)",
          }}
        >
          <div className={filterType === "merged" ? "block" : "hidden"}>
            {!mergedLoaded && mergedPRs.length === 0 ? (
              <div className="flex flex-col">
                {Array.from({ length: initialCount }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2.5 border-b border-black/10 px-4 py-4 dark:border-white/[0.12]">
                    <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-3.5 w-3/4 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
                  </div>
                ))}
              </div>
            ) : mergedPRs.length > 0 ? (
              <div className="flex flex-col">
                {mergedPRs.slice(0, isFullPage ? mergedPRs.length : initialCount).map((pr, index, visiblePRs) => (
                  <a
                    key={pr.id}
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col gap-1.5 rounded-lg px-4 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/20"
                  >
                    {index < visiblePRs.length - 1 && (
                      <div className="absolute bottom-0 left-0 right-0 h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)", WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)" }} />
                    )}
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="h-2 w-2 shrink-0 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                      <h3 className="truncate text-[14px] font-medium text-zinc-800 transition-colors group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-zinc-100">
                        {pr.title}
                      </h3>
                    </div>
                    <p className="ml-4.5 pl-0.5 text-[12px] text-zinc-500 dark:text-zinc-400">
                      {pr.repository.nameWithOwner}
                      {pr.number ? ` · PR #${pr.number}` : ""}
                      {" · Merged"}
                      {pr.mergedDate
                        ? ` ${pr.mergedDate}`
                        : pr.mergedAt
                          ? ` ${new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(pr.mergedAt))}`
                          : ""}
                    </p>
                    {pr.technicalDetails && (
                      <p className="ml-4.5 pl-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                        {pr.technicalDetails.join(" · ")}
                      </p>
                    )}
                  </a>
                ))}
                {!isFullPage && mergedPRs.length > initialCount && (
                  <div className="relative z-20 mt-4 flex justify-center">
                    <Link href="/pull-requests" className="relative block group">
                      <div className="absolute -inset-[5px] rounded-[11px] border border-black/5 transition-colors group-hover:border-black/10 dark:border-white/5 dark:group-hover:border-white/10" />
                      <div className="relative flex items-center gap-1.5 rounded-[6px] border border-black/5 bg-zinc-50 px-4 py-2 text-[13px] font-medium text-zinc-600 shadow-sm shadow-black/20 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/5 dark:bg-[#09090b] dark:text-zinc-400 dark:shadow-lg dark:shadow-black/80 dark:hover:bg-[#121214] dark:hover:text-zinc-100">
                        View All ({mergedPRs.length - initialCount} more)
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center text-[13px] text-zinc-500">
                {mergedError
                  ? "GitHub merged pull request data is temporarily unavailable. Please try again later."
                  : "No merged pull requests found."}
              </div>
            )}
          </div>
          <div className={filterType === "activity" ? "block" : "hidden"}>
            <GitHubActivityTimeline active={filterType === "activity"} />
          </div>
        </div>
      </div>
    </div>
  );
}
