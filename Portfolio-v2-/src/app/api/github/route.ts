import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");
  const page = Number(searchParams.get("page") ?? "1");

  if (state !== "merged" || !Number.isInteger(page) || page < 1 || page > 10) {
    return NextResponse.json({ error: "Invalid pull request search parameters." }, { status: 400 });
  }

  const query = "author:DeepanB15 type:pr is:merged";
  const url = new URL("https://api.github.com/search/issues");
  url.searchParams.set("q", query);
  url.searchParams.set("per_page", "100");
  url.searchParams.set("page", String(page));

  try {
    const token = process.env.GITHUB_TOKEN;
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "DeepanB15-portfolio",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      const message = `GitHub pull request search failed (${response.status}).`;
      console.error(message, await response.text());
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const result = await response.json();
    const edges = result.items.map((item: {
      id: number;
      title: string;
      html_url: string;
      repository_url: string;
      state: string;
      created_at: string;
      pull_request?: { merged_at?: string | null };
    }) => ({
      node: {
        id: item.id,
        number: Number(item.html_url.split("/").pop()),
        title: item.title,
        url: item.html_url,
        repository: {
          nameWithOwner: item.repository_url.replace("https://api.github.com/repos/", ""),
        },
        state: item.pull_request?.merged_at
          ? "MERGED"
          : item.state.toUpperCase(),
        createdAt: item.created_at,
        mergedAt: item.pull_request?.merged_at ?? null,
      },
    }));

    return NextResponse.json({
      data: {
        search: {
          edges,
          pageInfo: {
            hasNextPage: page < 10 && page * 100 < result.total_count,
            endCursor: page < 10 && page * 100 < result.total_count ? String(page + 1) : null,
          },
        },
      },
    });
  } catch (error) {
    console.error("GitHub pull request search request failed.", error);
    return NextResponse.json({ error: "GitHub pull request data is temporarily unavailable." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Missing GITHUB_TOKEN credential.", message: "Bad credentials" },
      { status: 401 },
    );
  }

  try {
    const body: unknown = await request.json();
    if (
      typeof body !== "object" ||
      body === null ||
      !("query" in body) ||
      typeof body.query !== "string"
    ) {
      return NextResponse.json({ error: "A GraphQL query is required." }, { status: 400 });
    }

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: body.query }),
      cache: "no-store",
    });
    const data = await response.json();

    if (!response.ok || data.errors?.length) {
      console.error("GitHub GraphQL request failed.", data.errors ?? response.statusText);
      return NextResponse.json(
        { error: "GitHub GraphQL data is temporarily unavailable." },
        { status: response.ok ? 502 : response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GitHub GraphQL proxy request failed.", error);
    return NextResponse.json({ error: "GitHub GraphQL data is temporarily unavailable." }, { status: 502 });
  }
}
