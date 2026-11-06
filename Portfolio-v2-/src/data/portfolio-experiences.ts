import { pipeshubContributions, pipeshubTechnicalDetails } from "./pipeshub-contributions";

export type ExperienceLink = {
  label: string;
  href: string;
};

export type ExperienceData = {
  title: string;
  role: string;
  dates: string;
  location: string;
  src?: string;
  type?: string;
  imageFit?: "contain" | "cover";
  imageZoom?: number;
  description: string;
  tech: string[];
  tags?: string[];
  metrics?: { label: string; value: string }[];
  screenshot?: string;
  links?: ExperienceLink[];
};

export const freelanceExperience: ExperienceData = {
  title: "Freelance",
  role: "Full-Stack Developer",
  dates: "September 2026 – November 2026",
  location: "Remote",
  src: "/logos/freelance.png",
  imageFit: "contain",
  description:
    "Full-stack development using React.js, Next.js, TypeScript, FastAPI, Python, REST APIs, PostgreSQL, and UI/UX design, with client communication.",
  tech: [
    "React.js",
    "Next.js",
    "TypeScript",
    "FastAPI",
    "Python",
    "REST APIs",
    "PostgreSQL",
    "UI/UX Design",
    "Client Communication",
  ],
  tags: [
    "React.js",
    "Next.js",
    "TypeScript",
    "FastAPI",
    "Python",
    "REST APIs",
    "PostgreSQL",
    "UI/UX Design",
    "Client Communication",
  ],
};

export const pipeshubExperience: ExperienceData = {
  title: "PipesHub AI",
  role: "Open Source Contributor",
  dates: "November 2026",
  location: "Remote",
  src: "/Experience-image/pngegg (1).png",
  imageFit: "contain",
  imageZoom: 1.5,
  description: [
    ...pipeshubContributions.map(
      (contribution) =>
        `${contribution.title}: PR #${contribution.number} merged ${contribution.mergedDate}`,
    ),
    `Both integrations use ${pipeshubTechnicalDetails.slice(0, 3).join(", ")}, and include tests`,
  ].join("\n"),
  tech: [...pipeshubTechnicalDetails],
  metrics: [
    { label: "Merged PRs", value: "2" },
    { label: "MCP integrations", value: "2" },
    { label: "Authentication", value: "OAuth 2.0" },
    { label: "Transport", value: "Streamable HTTP" },
  ],
  links: pipeshubContributions.map((contribution) => ({
    label: `${contribution.title} PR #${contribution.number}`,
    href: contribution.url,
  })),
};

export const stratiqExperience: ExperienceData = {
  title: "StratIQ",
  role: "AI Developer / Co-Founder",
  dates: "March 2026 – June 2026",
  location: "Chennai, India",
  src: "/highlights/stratiq.png",
  imageFit: "contain",
  imageZoom: 1,
  description: `
    Co-founded StratIQ and built LeadPilotAI, an AI-powered B2B research platform that turns raw lead lists into evidence-backed company profiles and insights.
    Developed an internal CRM and team management system to organize tasks, coordinate the team, and track project workflows.
    Worked directly with clients to translate requirements into websites and software, covering frontend and UI design.
  `,
  tech: ["Next.js", "FastAPI", "PostgreSQL", "Ollama", "Docker"],
  metrics: [
    { label: "AI product shipped", value: "1" },
    { label: "Internal tools", value: "2" },
  ],
};

export const ieiExperience: ExperienceData = {
  title: "IEI Student Chapter",
  role: "Vice President",
  dates: "July 2025 – August 2026",
  location: "Chennai, India",
  src: "/logos/iei.png",
  imageFit: "contain",
  imageZoom: 1,
  description: `
    Workshops & Talks: Coordinated AI-focused workshops, technical talks, and seminars with student teams and organizers.
    AI Initiatives: Supported student engagement in AI and emerging technology activities.
    Leadership: Collaborated with student teams and organizers to coordinate chapter activities and technical events.
    Execution: Contributed to planning and organizing technical sessions and student-focused initiatives.
  `,
  tech: [
    "Leadership",
    "AI",
    "Technical Workshops",
    "Technical Talks",
    "Event Coordination",
    "Team Collaboration",
  ],
  tags: [
    "Leadership",
    "AI",
    "Technical Workshops",
    "Technical Talks",
    "Event Coordination",
    "Team Collaboration",
  ],
};

export const experiences: ExperienceData[] = [
  freelanceExperience,
  pipeshubExperience,
  stratiqExperience,
  ieiExperience,
];