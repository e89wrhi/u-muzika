import { describe, it, expect, vi } from 'vitest';
import { siteConfig } from './site';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/../env.mjs', () => ({
  env: {
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  },
}));

// Mock the image import
vi.mock('@/assets/logo.png', () => ({
  default: { src: '/logo.png' },
}));

describe('siteConfig', () => {
  it('should have correct basic information', () => {
    expect(siteConfig.name).toBe('U Muzika');
    expect(siteConfig.url).toBe('http://localhost:3000');
  });
});
