import { describe, it, expect, vi } from 'vitest';
import { getCurrentProfile } from './getCurrentProfile';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

vi.mock('@clerk/nextjs/server', () => ({
  currentUser: vi.fn(),
}));

vi.mock('@/lib/supabaseAdmin', () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  },
}));

describe('getCurrentProfile', () => {
  it('should return null if no user is found', async () => {
    vi.mocked(currentUser).mockResolvedValueOnce(null);
    const result = await getCurrentProfile();
    expect(result).toBeNull();
  });

  it('should return user and profile if found', async () => {
    const mockUser = { id: 'clerk_123' };
    const mockProfile = { id: 1, name: 'John Doe' };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(currentUser).mockResolvedValueOnce(mockUser as any);

    const mockSingle = vi.fn().mockResolvedValueOnce({ data: mockProfile });
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce({
      select: vi.fn().mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          single: mockSingle,
        }),
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const result = await getCurrentProfile();
    expect(result).toEqual({ user: mockUser, profile: mockProfile });
  });
});
