import { renderHook } from '@testing-library/react';
import { useMounted } from './use-mounted';
import { describe, it, expect } from 'vitest';

describe('useMounted', () => {
  it('should return true after mounting', () => {
    const { result } = renderHook(() => useMounted());
    expect(result.current).toBe(true);
  });
});
