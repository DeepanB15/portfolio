import type { ComponentType } from "react";
import { BrainCircuit, Code2, Database, FileCheck2, Network, Search } from "lucide-react";
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
  SiUltralytics,
  SiOpencv,
  SiFlask,
  SiPostgresql,
  SiDocker,
  SiOllama,
  SiModelcontextprotocol,
} from "react-icons/si";

export type TechIcon = ComponentType<{ className?: string }>;
export type TechKey =
  | "next" | "ts" | "react" | "three" | "prisma" | "cloud" | "langchain" | "langgraph" | "rag"
  | "node" | "motion" | "tailwind" | "bun" | "eslint" | "radixui" | "charts" | "github" | "fastapi"
  | "redis" | "celery" | "tldraw" | "css3" | "python" | "anthropic" | "claude" | "gemini" | "llama"
  | "ultralytics" | "opencv" | "flask" | "postgresql" | "docker" | "ollama" | "mcp" | "treesitter"
  | "networkx" | "pgvector" | "bertopic" | "explainable";

export type TechItem = TechKey | { label: string; tooltip?: string; icon?: TechIcon };

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
  ultralytics: SiUltralytics, opencv: SiOpencv, flask: SiFlask,
  postgresql: SiPostgresql, docker: SiDocker, ollama: SiOllama,
  mcp: SiModelcontextprotocol, treesitter: Code2, networkx: Network,
  pgvector: Database, bertopic: BrainCircuit, explainable: FileCheck2,
};

export const techNames: Record<TechKey, string> = {
  next: "Next.js", ts: "TypeScript", react: "React", three: "Three.js", prisma: "Prisma",
  cloud: "Cloudflare", langchain: "LangChain", langgraph: "LangGraph", rag: "RAG",
  node: "Node.js", motion: "Framer Motion", tailwind: "Tailwind CSS", bun: "Bun", eslint: "ESLint",
  radixui: "Radix UI", charts: "Charts", github: "GitHub API", fastapi: "FastAPI", redis: "Redis",
  celery: "Celery", tldraw: "tldraw", css3: "CSS3", python: "Python", anthropic: "Anthropic",
  claude: "Claude", gemini: "Gemini", llama: "LLaMA",
  ultralytics: "Ultralytics", opencv: "OpenCV", flask: "Flask",
  postgresql: "PostgreSQL", docker: "Docker", ollama: "Ollama",
  mcp: "Model Context Protocol", treesitter: "Tree-sitter", networkx: "NetworkX",
  pgvector: "pgvector", bertopic: "BERTopic", explainable: "Explainable Reports",
};

export const projectsData: Project[] = [
  {
    slug: "kitehut",
    title: "KiteHut",
    imageTitle: "Landing Page",
    src: "/project-image/kitehut.jpeg",
    lightModeSrc: "/project-image/kitehut.jpeg",
    video: "",
    description:
      "Local-first repository intelligence engine: a code graph, context-aware retrieval and an evidence engine that verifies AI explanations against source code.",
    tags: ["Python", "FastAPI", "Tree-sitter", "NetworkX", "RAG", "Ollama", "MCP", "React"],
    tech: [
      "python",
      "fastapi",
      { label: "Tree-sitter", icon: iconMap.treesitter },
      { label: "NetworkX", icon: iconMap.networkx },
      "rag",
      { label: "Ollama", icon: iconMap.ollama },
      { label: "MCP", icon: iconMap.mcp },
      "react",
    ],
    href: "https://github.com/DeepanB15/kiteHut",
    backgroundImage: "/project-hover-blueprint.webp",
    hasPin: false,
    status: "Building",
  },
  {
    slug: "tratepra",
    title: "Tratepra",
    imageTitle: "App Interface",
    src: "/project-image/tratepra.jpeg",
    lightModeSrc: "/project-image/tratepra.jpeg",
    video: "",
    description:
      "AI research and trend intelligence platform that finds emerging trends across sources using semantic analysis, topic clustering and trend scoring.",
    tags: ["React", "FastAPI", "pgvector", "BERTopic", "Ollama", "MCP"],
    tech: [
      "react",
      "fastapi",
      { label: "pgvector", icon: iconMap.pgvector },
      { label: "BERTopic", icon: iconMap.bertopic },
      { label: "Ollama", icon: iconMap.ollama },
      { label: "MCP", icon: iconMap.mcp },
    ],
    href: "https://github.com/DeepanB15/micro-trend",
    backgroundImage: "/project-hover-inquiro.webp",
    hasPin: false,
    status: "Building",
  },
  {
    slug: "leadpilotai",
    title: "LeadPilotAI",
    imageTitle: "B2B Research Platform",
    src: "/project-image/leadscope.jpeg",
    lightModeSrc: "/project-image/leadscope.jpeg",
    video: "",
    description:
      "B2B company research platform that converts lead lists into structured intelligence reports with sources and confidence indicators.",
    tags: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Docker"],
    tech: [
      "next",
      "ts",
      "fastapi",
      { label: "PostgreSQL", icon: iconMap.postgresql },
      { label: "Docker", icon: iconMap.docker },
    ],
    href: "https://github.com/DeepanB15/Leadpilotai",
    backgroundImage: "/project-hover-scribble3d.webp",
    hasPin: false,
    status: "Live",
  },
  {
    slug: "engine-vision",
    title: "Engine Vision",
    imageTitle: "Engine Component Inspection",
    src: "/project-image/engine-vision.jpeg",
    lightModeSrc: "/project-image/engine-vision.jpeg",
    video: "",
    description:
      "YOLOv8 Nano fine-tuned for 26 engine component classes, with OpenCV preprocessing, Present, Potentially Missing, and Uncertain inspection states, a Flask API and dashboard, and explainable reports.",
    tags: ["YOLOv8 Nano", "OpenCV", "Flask", "Explainable Reports"],
    tech: [
      { label: "YOLOv8 Nano", icon: iconMap.ultralytics },
      { label: "OpenCV", icon: iconMap.opencv },
      { label: "Flask", icon: iconMap.flask },
      { label: "Explainable Reports", icon: iconMap.explainable },
    ],
    href: "https://github.com/DeepanB15/ai-engine-inspection-system",
    backgroundImage: "/project-hover-vengenceui.webp",
    hasPin: false,
    status: "Live",
  },
];