# U Muzika Web Application

The U Muzika Web App is the primary engine of the platform, delivering a world-class music discovery interface built on Next.js 15.

## 🎨 Design Philosophy

The application prioritizes **Visual Excellence** and **High-End Aesthetics**:
- **Spotify-Inspired**: Familiar yet elevated layouts for tracks and playlists.
- **Micro-Animations**: Hover-triggered play buttons, scale-up transformations, and pulsing backdrop orbs.
- **Glassmorphism**: Extensive use of backdrop filters and semi-transparent layers for a deep, layered UI.
- **Red Theme**: A consistent primary palette centered around `red-600` for a bold, energetic feel.

## 🚀 Key Page Types

### Artist Profile
- Dynamic headers with profile images and YouTube verified checkmarks.
- Formatted bios with interactive hashtags and external links.
- Responsive Discography and Video grids.

### Video / Player View
- Smart detection of **YouTube Shorts** with vertical aspect ratio support.
- Minimalist "Stats-First" layout with oversized view counts.
- Instant "Copy Link" to clipboard with visual toast feedback.

### Album / Collection View
- Immersive background "glow" effects matching the collection artwork.
- Batch-computed total playtime and collection-wide view counts.

## 🛠️ Technical Implementation

- **Next.js 15 (App Router)**: Utilizing Server Components for fast data fetching and Client Components for interactive UI.
- **YouTube Data API v3**: Fully integrated for real-time channel, playlist, and video data.
- **SEO & Metadata**: Automated generation of `Metadata` for every dynamic route ensuring high-quality previews on social platforms.
- **Utility-First Styling**: Built with the latest Tailwind CSS features.

## 📦 Navigation

- `(main)/a/[artist-name]`: Dynamic Artist Profiles
- `(main)/v/[video]`: Dynamic Video Player
- `(main)/al/[album]`: Dynamic Playlist/Album Collections
- `(main)/not-found.tsx`: Premium 404 Experience
- `(main)/error.tsx`: Graceful Error Handling
