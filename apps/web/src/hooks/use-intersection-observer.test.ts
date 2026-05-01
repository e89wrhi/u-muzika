import { renderHook } from '@testing-library/react';
import useIntersectionObserver from './use-intersection-oberver';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('useIntersectionObserver', () => {
  const mockObserve = vi.fn();
  const mockDisconnect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.IntersectionObserver = vi.fn().mockImplementation(function () {
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: vi.fn(),
        takeRecords: vi.fn(),
        root: null,
        rootMargin: '',
        thresholds: [],
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;
  });

  it('should call observe on mount', () => {
    const element = document.createElement('div');
    const ref = { current: element };
    renderHook(() => useIntersectionObserver(ref, {}));

    expect(mockObserve).toHaveBeenCalledWith(element);
  });

  it('should disconnect on unmount', () => {
    const element = document.createElement('div');
    const ref = { current: element };
    const { unmount } = renderHook(() => useIntersectionObserver(ref, {}));

    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
