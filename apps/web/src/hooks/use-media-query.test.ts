import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from './use-media-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('useMediaQuery', () => {
  const mockMatchMedia = (matches: boolean) => {
    return (query: string) => ({
      matches: matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock
    window.matchMedia = vi.fn().mockImplementation(mockMatchMedia(false));
    window.innerWidth = 1024;
    window.innerHeight = 768;
  });

  it('should detect desktop by default if no matches', () => {
    const { result } = renderHook(() => useMediaQuery());
    expect(result.current.device).toBe('desktop');
    expect(result.current.isDesktop).toBe(true);
  });

  it('should detect mobile when query matches', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(max-width: 640px)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery());
    expect(result.current.device).toBe('mobile');
    expect(result.current.isMobile).toBe(true);
  });

  it('should update on resize', () => {
    const { result } = renderHook(() => useMediaQuery());
    act(() => {
      window.innerWidth = 500;
      // Change matchMedia to return mobile
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(max-width: 640px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.device).toBe('mobile');
    expect(result.current.width).toBe(500);
  });
});
