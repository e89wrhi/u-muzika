import { renderHook, act } from '@testing-library/react';
import { useScroll } from './use-scroll';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useScroll', () => {
  beforeEach(() => {
    window.pageYOffset = 0;
  });

  it('should return false initially if scroll is at 0', () => {
    const { result } = renderHook(() => useScroll(100));
    expect(result.current).toBe(false);
  });

  it('should return true when scroll exceeds threshold', () => {
    const { result } = renderHook(() => useScroll(100));

    act(() => {
      window.pageYOffset = 150;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(true);
  });

  it('should return false when scroll is below threshold after being above', () => {
    const { result } = renderHook(() => useScroll(100));

    act(() => {
      window.pageYOffset = 150;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe(true);

    act(() => {
      window.pageYOffset = 50;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe(false);
  });
});
