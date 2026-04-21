import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1).optional().default('http://localhost:3000'),
  },
  runtimeEnv: {
    // Client-side
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
