import { Icons } from '@/components/shared/icons';
import { UserRole } from '@/lib/validations/user';

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mailSupport: string;
  links: {
    twitter: string;
    github: string;
  };
}

export interface NavItem {
  title: string;
  href: string;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
}

export type MainNavItem = NavItem;

export interface MarketingConfig {
  mainNav: MainNavItem[];
}
