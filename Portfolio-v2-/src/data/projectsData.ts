import type { ComponentType } from "react";
import { Network, Search } from "lucide-react";
import {
  SiNextdotjs,
  SiTypescript,
  SiReact,
  SiThreedotjs,
  SiPrisma,
  SiCloudflare,
  SiLangchain,
  SiNodedotjs,
  SiFramer,
  SiTailwindcss,
  SiBun,
  SiEslint,
  SiRadixui,
  SiChartdotjs,
  SiGithub,
  SiFastapi,
  SiRedis,
  SiCelery,
  SiTldraw,
  SiCss,
  SiPython,
  SiAnthropic,
  SiClaude,
  SiGooglegemini,
  SiMeta,
} from "react-icons/si";

export type TechIcon = ComponentType<{ className?: string }>;
export type TechKey =
  | "next" | "ts" | "react" | "three" | "prisma" | "cloud" | "langchain" | "langgraph" | "rag"
  | "node" | "motion" | "tailwind" | "bun" | "eslint" | "radixui" | "charts" | "github" | "fastapi"
  | "redis" | "celery" | "tldraw" | "css3" | "python" | "anthropic" | "claude" | "gemini" | "llama";

export type TechItem = TechKey | { label: string; tooltip?: string; };

export interface Project {
  slug: string;
  title: string;
  imageTitle: string;
  src: string;
  lightModeSrc?: string;
  video?: string;
  description: string;
  tags: string[];
  tech: TechItem[];
  href?: string; // repo or live URL
  live?: string;
  backgroundImage?: string;
  hasPin: boolean;
  status: "Building" | "Live" | "Not Started";
}

export const iconMap: Record<TechKey, TechIcon> = {
  next: SiNextdotjs, ts: SiTypescript, react: SiReact, three: SiThreedotjs, prisma: SiPrisma,
  cloud: SiCloudflare, langchain: SiLangchain, langgraph: Network, rag: Search, node: SiNodedotjs,
  motion: SiFramer, tailwind: SiTailwindcss, bun: SiBun, eslint: SiEslint, radixui: SiRadixui,
  charts: SiChartdotjs, github: SiGithub, fastapi: SiFastapi, redis: SiRedis, celery: SiCelery,
  tldraw: SiTldraw, css3: SiCss, python: SiPython, anthropic: SiAnthropic, claude: SiClaude,
  gemini: SiGooglegemini, llama: SiMeta,
};

export const techNames: Record<TechKey, string> = {
  next: "Next.js", ts: "TypeScript", react: "React", three: "Three.js", prisma: "Prisma",
  cloud: "Cloudflare", langchain: "LangChain", langgraph: "LangGraph", rag: "RAG",
  node: "Node.js", motion: "Framer Motion", tailwind: "Tailwind CSS", bun: "Bun", eslint: "ESLint",
  radixui: "Radix UI", charts: "Charts", github: "GitHub API", fastapi: "FastAPI", redis: "Redis",
  celery: "Celery", tldraw: "tldraw", css3: "CSS3", python: "Python", anthropic: "Anthropic",
  claude: "Claude", gemini: "Gemini", llama: "LLaMA",
};

export const projectsData: Project[] = [
  {
    slug: "kitehut",
    title: "KiteHut",
    imageTitle: "Landing Page",
    src: "/project-hover-blueprint.webp",
    lightModeSrc: "/project-hover-blueprint.webp",
    video: "",
    description:
      "Local-first repository intelligence engine: a code graph, context-aware retrieval and an evidence engine that verifies AI explanations against source code.",
    tags: ["Python", "FastAPI", "Tree-sitter", "NetworkX", "RAG", "Ollama", "MCP", "React"],
    tech: ["python", "fastapi", { label: "Tree-sitter" }, { label: "NetworkX" }, "rag", { label: "Ollama" }, { label: "MCP" }, "react"],
    href: "https://github.com/DeepanB15/kiteHut",
    backgroundImage: "/project-hover-blueprint.webp",
    hasPin: false,
    status: "Building",
  },
  {
    slug: "tratepra",
    title: "Tratepra",
    imageTitle: "App Interface",
    src: "/project-hover-inquiro.webp",
    lightModeSrc: "/project-hover-inquiro.webp",
    video: "",
    description:
      "AI research and trend intelligence platform that finds emerging trends across sources using semantic analysis, topic clustering and trend scoring.",
    tags: ["React", "FastAPI", "pgvector", "BERTopic", "Ollama", "MCP"],
    tech: ["react", "fastapi", { label: "pgvector" }, { label: "BERTopic" }, { label: "Ollama" }, { label: "MCP" }],
    href: "https://github.com/DeepanB15/micro-trend",
    backgroundImage: "/project-hover-inquiro.webp",
    hasPin: false,
    status: "Building",
  },
  {
    slug: "leadpilotai",
    title: "LeadPilotAI",
    imageTitle: "B2B Research Platform",
    src: "/project-hover-scribble3d.webp",
    lightModeSrc: "/project-hover-scribble3d.webp",
    video: "",
    description:
      "B2B company research platform that converts lead lists into structured intelligence reports with sources and confidence indicators.",
    tags: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Docker"],
    tech: ["next", "ts", "fastapi", { label: "PostgreSQL" }, { label: "Docker" }],
    href: "https://github.com/DeepanB15/Leadpilotai",
    backgroundImage: "/project-hover-scribble3d.webp",
    hasPin: false,
    status: "Building",
  },
  {
    slug: "ai-engine-inspection-system",
    title: "AI Engine Component Inspection System",
    imageTitle: "Engine Component Inspection",
    src: "/project-hover-vengenceui.webp",
    lightModeSrc: "/project-hover-vengenceui.webp",
    video: "",
    description:
      "YOLOv8 Nano fine-tuned for 26 engine component classes, with OpenCV preprocessing, Present, Potentially Missing, and Uncertain inspection states, a Flask API and dashboard, and explainable reports.",
    tags: ["YOLOv8 Nano", "OpenCV", "Flask", "Explainable Reports"],
    tech: [
      { label: "YOLOv8 Nano" },
      { label: "OpenCV" },
      { label: "Flask" },
    ],
    href: "https://github.com/DeepanB15/ai-engine-inspection-system",
    backgroundImage: "/project-hover-vengenceui.webp",
    hasPin: false,
    status: "Building",
  },
];