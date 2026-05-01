import { renderHook } from '@testing-library/react';
import { useLockBody } from './use-lock-body';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useLockBody', () => {
  beforeEach(() => {
    document.body.style.overflow = 'visible';
  });

  it('should lock body scroll on mount', () => {
    renderHook(() => useLockBody());
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body scroll on unmount', () => {
    const { unmount } = renderHook(() => useLockBody());
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('visible');
  });
});
