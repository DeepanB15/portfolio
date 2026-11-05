

# Deepan B — Portfolio

A minimal, fast, and interactive developer portfolio built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **TypeScript**.

It showcases my work, experience, open-source contributions, skills, and writing — with a dark/light theme, smooth motion, and a command palette for quick navigation.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 16 (App Router)
- **Library:** [React](https://react.dev/) 19
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/), [GSAP](https://greensock.com/gsap/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons:** [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- **Deployment:** [Vercel](https://vercel.com/) with Analytics & Speed Insights

---

## Features

- Responsive, grid-based layout with blueprint-style micro-details
- Dark and light mode with system preference detection
- Command palette (`Cmd/Ctrl + K`) for quick navigation
- Interactive GitHub contribution graph
- Project showcase with detail pages
- Experience timeline
- Open-source contributions section
- Skills and technologies grid
- Blog listing
- Contact page
- Sound-engineered micro-interactions

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm / yarn / pnpm / bun

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
```

### GitHub activity and pull requests

The contribution calendar uses GitHub GraphQL when `GITHUB_TOKEN` is configured, then falls back to the public [GitHub Contributions API](https://github-contributions-api.jogruber.de/) for `DeepanB15`. Pull-request tabs use GitHub's public search API; configuring the token also raises the API rate limit. The token is read only by server-side routes and is never exposed to browser code.

For local development, copy `.env.example` to `.env.local` and add a GitHub token with read-only access to public user data:

```text
GITHUB_TOKEN=your_github_token
```

On Vercel, open **Project Settings → Environment Variables**, add `GITHUB_TOKEN`, select the required deployment environments, save, and redeploy. Do not use a `NEXT_PUBLIC_` prefix or commit the token.

### Start the production server

```bash
npm start
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```text
Portfolio-v2-
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components & UI primitives
│   ├── data/                # Projects and blogs data
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Utility functions and sound engine
├── public/                  # Static assets
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

---

## Deployment

This site is optimized for deployment on [Vercel](https://vercel.com/). Connect your GitHub repository to Vercel and deploy with zero configuration.

For other platforms, use the static or Node.js output mode configured in `next.config.ts`.

---

## Connect

- **GitHub:** [DeepanB15](https://github.com/DeepanB15)
- **LinkedIn:** [Deepan B](https://linkedin.com/in/deepanb)
- **Email:** [deepan.b.150706@gmail.com](mailto:deepan.b.150706@gmail.com)

---

Built with purpose, precision, and a little bit of chaos.
