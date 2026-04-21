import { SiteConfig } from '@/types';
import { env } from '@/../env.mjs';
import icon from '@/assets/favicon.png';

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: 'U Muzika',
  description: 'Youtub music client built with Next.js',
  url: site_url,
  ogImage: icon.src,
  links: {
    twitter: 'https://twitter.com/umuzika',
    github: 'https://github.com/umuzika',
  },
  mailSupport: 'support@umuzika.com',
};
