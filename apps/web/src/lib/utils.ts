import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Metadata } from 'next';

import { siteConfig } from '@/config/site';
import icon from '@/assets/favicon.png';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = icon.src,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    keywords: [],
    authors: [],
    creator: 'muzika',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      title,
      description,
      siteName: title,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: 'muzika',
    },
    icons,
    metadataBase: new URL(siteConfig.url),
    manifest: '/manifest.json',
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

// formatted time for list item
export function formatDate(input: Date | null): string {
  if (!input) return 'N/A';
  var date = new Date(input);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  });
}

export function absoluteUrl(path: string) {
  return `${path}`;
}
