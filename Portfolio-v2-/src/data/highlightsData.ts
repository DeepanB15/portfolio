export type Highlight = {
  id: string;
  title: string;
  badge: string;
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
    image: "/highlights/sih-2024.png",
    imageWidth: 1415,
    imageHeight: 1112,
    imageFit: "contain",
    cardWidth: 255,
  },
  {
    id: "mcprs-2026",
    title: "2 Merged MCP PRs",
    subtitle: "PipesHub AI open source",
    badge: "MCP PRs",
    image: "/highlights/mcp-prs.png",
    imageWidth: 1277,
    imageHeight: 1232,
    imageFit: "contain",
    cardWidth: 208,
  },
  {
    id: "stratiq-2026",
    title: "Co-Founder, StratIQ",
    subtitle: "Built LeadPilotAI",
    badge: "StratIQ",
    image: "/highlights/stratIQ.png",
    imageWidth: 1622,
    imageHeight: 970,
    imageFit: "contain",
    cardWidth: 334,
  },
  {
    id: "vei-2025",
    title: "Vice President, IEI Chapter",
    subtitle: "AI workshops and seminars",
    badge: "IEI Chapter",
    image: "/highlights/iei.png",
    imageWidth: 582,
    imageHeight: 497,
    imageFit: "contain",
    cardWidth: 200,
  },
];