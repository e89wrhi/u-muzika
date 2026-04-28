# U Muzika

U Muzika is a premium, high-performance music discovery platform powered by the YouTube Data API v3. Designed with a state-of-the-art "Spotify-inspired" aesthetic, it offers an immersive environment for exploring artists, albums, and videos in a sleek, Red-themed interface.

## 🌟 Key Features

- **Artist Profiles**: Immersive artist pages with dynamic discography grids, bio formatting (hashtags/mentions support), and profile-matched aesthetics.
- **Premium Album View**: High-end "Collection" pages with blurred background gradients, batch-calculated playtime, and total view counts.
- **Video Viewing Experience**: Cinematic video player with vertical "Shorts" support, larger statistics, and instant "Copy Link" functionality.
- **Real-Time YouTube Sync**: Leverages batch data fetching to provide live subscriber counts, views, and video durations directly from YouTube.
- **Premium Aesthetics**: A curated dark-mode focused design with glassmorphism, fluid animations, and a bold Red-600 accent theme.
- **SEO Optimized**: Dynamic metadata generation for all artists, videos, and playlists to ensure professional social sharing and search indexing.

## 🏗️ Architecture

This project is built as a high-performance monorepo using [Turborepo](https://turbo.build/):

### Applications

- **`apps/web`**: The main Next.js 15 application (App Router).

### Shared Packages

- **`packages/ui`**: Shared UI component library built on Lucide and Tailwind CSS.
- **`packages/lib`**: Core logic including the custom YouTube API wrapper, duration parsers, and formatting utilities.
- **`packages/typescript-config`**: Standardized TS configurations across the workspace.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) 10+
- A [YouTube Data API v3 Key](https://console.cloud.google.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/u-muzika
   cd u-muzika
   ```

2. Configure Environment:
   Create a `.env` file in the root or `apps/web` with your YouTube API Key:

   ```env
   YOUTUBE_API_KEY=YOUR_API_KEY_HERE
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development cluster:

```bash
npm run dev
```

The web application runs on `http://localhost:3000`.

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Infrastructure**: [Turborepo](https://turbo.build/)
