export type ExperienceData = {
  title: string;
  role: string;
  dates: string;
  location: string;
  src: string;
  type?: string;
  imageFit?: "contain" | "cover";
  imageZoom?: number;
  description: string;
  tech: string[];
  metrics?: { label: string; value: string }[];
  screenshot?: string;
};

export const experiences: ExperienceData[] = [
  {
    title: "StratIQ",
    role: "AI Developer / Co-Founder",
    dates: "Mar 2026 – Jun 2026",
    location: "Chennai, India",
    src: "/Experience-image/stratIQ.png",
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
  },
  {
    title: "IEI Student Chapter",
    role: "Vice President",
    dates: "Jul 2025 – Aug 2026",
    location: "Chennai, India",
    src: "/Experience-image/iei-chapter.png",
    imageFit: "contain",
    imageZoom: 1,
    description: `
      Coordinated AI-focused workshops, technical talks, and seminars with student teams and organizers.
    `,
    tech: ["Leadership", "Community", "Events"],
    metrics: [{ label: "AI", value: "Workshops & talks" }],
  },
];