import { NextResponse } from "next/server";

export const revalidate = 3600;

type Contribution = { date: string; count: number; level: number };
type ContributionDay = { contributionCount: number; contributionLevel: string; date: string };
type ContributionWeek = { contributionDays: ContributionDay[] };

const contributionLevels = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
];

function toCalendar(contributions: Contribution[], reportedTotal?: number) {
  if (contributions.length === 0) {
    throw new Error("The contribution service returned an empty calendar.");
  }

  const firstDate = new Date(`${contributions[0].date}T00:00:00Z`);
  const lastDate = new Date(`${contributions[contributions.length - 1].date}T00:00:00Z`);
  const cursor = new Date(firstDate);
  cursor.setUTCDate(cursor.getUTCDate() - cursor.getUTCDay());

  const weeks: ContributionWeek[] = [];
  let week: ContributionDay[] = [];
  const monthNames: string[] = [];
  let previousMonth = "";

  for (const contribution of contributions) {
    const month = contribution.date.slice(0, 7);
    if (month !== previousMonth) {
      monthNames.push(
        new Intl.DateTimeFormat("en", { month: "long", timeZone: "UTC" })
          .format(new Date(`${month}-01T00:00:00Z`)),
      );
      previousMonth = month;
    }
  }

  const contributionsByDate = new Map(
    contributions.map((contribution) => [contribution.date, contribution]),
  );
  while (cursor <= lastDate) {
    const date = cursor.toISOString().slice(0, 10);
    if (date >= contributions[0].date && date <= contributions[contributions.length - 1].date) {
      const contribution = contributionsByDate.get(date);
      week.push({
        date,
        contributionCount: contribution?.count ?? 0,
        contributionLevel: contributionLevels[contribution?.level ?? 0],
      });
    }
    const isWeekEnd = cursor.getUTCDay() === 6 || date === contributions[contributions.length - 1].date;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    if (isWeekEnd) {
      if (week.length > 0) weeks.push({ contributionDays: week });
      week = [];
    }
  }

  return {
    totalContributions: reportedTotal ?? contributions.reduce((sum, item) => sum + item.count, 0),
    months: monthNames.map((name) => ({ name })),
    weeks,
  };
}

async function getGitHubCalendar(token: string) {
  const toDate = new Date();
  const fromDate = new Date(toDate);
  fromDate.setUTCFullYear(fromDate.getUTCFullYear() - 1);
  fromDate.setUTCDate(fromDate.getUTCDate() - fromDate.getUTCDay());
  const query = `
    query($from: DateTime!, $to: DateTime!) {
      user(login: "DeepanB15") {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            months { name }
            weeks {
              contributionDays { contributionCount contributionLevel date }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables: { from: fromDate.toISOString(), to: toDate.toISOString() },
    }),
    cache: "no-store",
  });
  const result = await response.json();
  const calendar = result.data?.user?.contributionsCollection?.contributionCalendar;

  if (!response.ok || result.errors?.length || !calendar?.weeks?.length) {
    throw new Error("GitHub GraphQL did not return a contribution calendar.");
  }

  return calendar;
}

async function getPublicCalendar() {
  const response = await fetch(
    "https://github-contributions-api.jogruber.de/v4/DeepanB15?y=last",
    {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    },
  );
  if (!response.ok) {
    throw new Error(`Public contribution calendar request failed (${response.status}).`);
  }

  const result = await response.json();
  if (!Array.isArray(result.contributions) || !result.contributions.every(isContribution)) {
    throw new Error("Public contribution calendar returned invalid data.");
  }

  return toCalendar(result.contributions, result.total?.lastYear);
}

function isContribution(item: unknown): item is Contribution {
  return (
    typeof item === "object" &&
    item !== null &&
    "date" in item &&
    typeof item.date === "string" &&
    "count" in item &&
    typeof item.count === "number" &&
    "level" in item &&
    typeof item.level === "number" &&
    Number.isInteger(item.level) &&
    item.level >= 0 &&
    item.level < contributionLevels.length
  );
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    try {
      return NextResponse.json(await getGitHubCalendar(token));
    } catch (error) {
      console.error("GitHub GraphQL contribution request failed; trying the public calendar.", error);
    }
  } else {
    console.warn("GITHUB_TOKEN is not configured; using the public GitHub contribution calendar.");
  }

  try {
    return NextResponse.json(await getPublicCalendar());
  } catch (error) {
    console.error("Public GitHub contribution calendar request failed.", error);
    return NextResponse.json(
      { error: "GitHub contribution activity is temporarily unavailable." },
      { status: 502 },
    );
  }
}
