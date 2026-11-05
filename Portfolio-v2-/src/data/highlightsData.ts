export type Highlight = {
  id: string;
  title: string;
  badge: string;
  subtitle?: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageFit?: "cover" | "contain";
  cardWidth?: number;
  link?: string;
};

export const highlightsData: Highlight[] = [
  {
    id: "gsoc-2024",
    title: "Smart India Hackathon 2024",
    subtitle: "National Semifinalist, Team Lead",
    badge: "SIH 2024",
    image: "/highlights/highlights-sih.png",
    imageWidth: 768,
    imageHeight: 768,
    imageFit: "contain",
    cardWidth: 255,
  },
  {
    id: "mcprs-2026",
    title: "2 Merged MCP PRs",
    subtitle: "PipesHub AI open source",
    badge: "MCP PRs",
    image: "/highlights/highlights-mcp_pr.png",
    imageWidth: 1254,
    imageHeight: 1254,
    imageFit: "contain",
    cardWidth: 208,
  },
  {
    id: "stratiq-2026",
    title: "Co-Founder, StratIQ",
    subtitle: "Built LeadPilotAI",
    badge: "StratIQ",
    image: "/highlights/highlights-startiq.jpeg",
    imageWidth: 1197,
    imageHeight: 1200,
    imageFit: "contain",
    cardWidth: 334,
  },
  {
    id: "vei-2025",
    title: "Vice President, IEI Chapter",
    subtitle: "AI workshops and seminars",
    badge: "IEI Chapter",
    image: "/highlights/highlights-iei.jpeg",
    imageWidth: 1600,
    imageHeight: 1200,
    imageFit: "contain",
    cardWidth: 200,
  },
];