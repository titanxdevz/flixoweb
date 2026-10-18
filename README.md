# Flixo Web — Discord Music Bot Website & Dashboard

A kawaii sticker-style web application and documentation portal for the **Flixo** Discord music bot. Built with Next.js 15, React 19, Tailwind CSS v4, and the Web Audio API.

## Features

- **Interactive DSP Audio Filter Demo**: Real-time browser audio synthesizer demonstrating DSP filters (Flat, 8D Audio, BassBoost, Nightcore, Vaporwave).
- **Audio-Reactive Mascot**: Dynamic mascot cutout that reacts to audio filters (8D sway, BassBoost beat bounce and edge pulsing, Nightcore speed, hop on click).
- **Complete Command Directory (`/commands`)**: Interactive searchable catalog of all 45+ slash commands with category tabs, parameter tables, permission levels, and deep-link copy buttons.
- **DSP Filter Catalog (`/filters`)**: Detailed technical catalog for all 14 DSP audio filters with live sound previews.
- **Live System Status (`/status`)**: Real-time status dashboard displaying active servers, voice listeners, cluster distribution, Lavalink node status, and rate limit rules.
- **Audio Sources (`/sources`)**: Technical directory for all 12 supported audio platforms and direct HTTP streaming.
- **Roles & Permissions (`/roles`)**: Complete guide to the 4-tier guild permission architecture (`admin`, `manager`, `dj`, `listener`).
- **Supporter Tiers (`/premium`)**: Transparent supporter comparison with zero paywalls on core 384kbps lossless audio.
- **Legal Suite**: Standardized legal layout with table of contents for `/terms`, `/privacy`, `/cookies`, `/acceptable-use`, `/refund`, and `/dmca`.
- **Zero Exposed APIs**: All bot data requests are handled server-side with caching and graceful fallbacks.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Fonts**: Fredoka (Display), Plus Jakarta Sans (Body), JetBrains Mono (Code)
- **Icons**: [Lucide React](https://lucide.dev/) + Custom SVG Stickers
- **Audio Engine**: Web Audio API (BiquadFilter, DynamicsCompressor, StereoPanner)

## Getting Started

### Prerequisites

- Node.js 18.17+ or Node.js 20+
- npm, pnpm, or yarn

### Installation

```bash
git clone https://github.com/titanxdevz/flixoweb.git
cd flixoweb
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

## Author

Created and developed by **Ansh Singh**.
