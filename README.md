# U Muzika

U Muzika is a premium, high-performance music discovery platform. Originally powered by the YouTube Data API v3, it has evolved into a full-scale SaaS platform with AI-driven discovery, secure authentication, and a robust credit-based billing system.

Designed with a state-of-the-art aesthetic, it offers an immersive environment for exploring artists, albums, and videos with a sleek, minimalist interface and fluid micro-animations.

## 🌟 Key Features

- **AI-Powered Discovery**: Leverage advanced AI to find and explore music, artists, and trends.
- **Secure Authentication**: Enterprise-grade auth powered by **Clerk**, including social logins and protected routes.
- **Credit-Based Usage**: Atomic credit system for AI operations, ensuring precise balance management across sessions.
- **Monetization & Billing**: Integrated **Stripe** checkout and subscription management (Starter, Pro, and Enterprise tiers).
- **Global Reach**: Full internationalization (i18n) support for English, Amharic, Japanese, Chinese, and Arabic.
- **Artist & Album Intelligence**: Immersive profiles with dynamic discography grids, bio formatting, and profile-matched aesthetics.
- **Fluid UI/UX**: Premium dark-mode focus with glassmorphism, 3D-animated carousels, and cinematic video playback.

## 🏗️ Architecture

Built as a high-performance monorepo using [Turborepo](https://turbo.build/):

- **`apps/web`**: Main Next.js 15 application (App Router, React 19).
- **`packages/ui`**: Shared UI component library built on **Radix UI**, **Lucide**, and **Tailwind CSS**.
- **`packages/lib`**: Core logic including YouTube API wrappers, database clients, and utility functions.
- **`packages/config`**: Standardized configurations for TypeScript, ESLint, and PostCSS.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [npm](https://www.npmjs.com/) 10+
- Accounts for [Clerk](https://clerk.com/), [Supabase](https://supabase.com/), and [Stripe](https://stripe.com/).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/u-muzika
   cd u-muzika
   ```

2. Configure Environment:
   Copy `.env.example` to `.env` in `apps/web` and fill in your credentials:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=...
   NEXT_PUBLIC_SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...
   STRIPE_SECRET_KEY=...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
   YOUTUBE_API_KEY=...
   ```

3. Install & Start:
   ```bash
   npm install
   npm run dev
   ```

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router), React 19 |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [Motion](https://motion.dev/) |
| **Auth** | [Clerk](https://clerk.com/) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **Billing** | [Stripe](https://stripe.com/) |
| **AI** | [Vercel AI SDK](https://sdk.vercel.ai/), OpenAI |
| **Internationalization** | `next-intl`, `i18next` |
| **UI Components** | [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) |
| **Toolkit** | [Turborepo](https://turbo.build/), TypeScript, Zod |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
