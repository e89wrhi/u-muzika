import type { Config } from 'tailwindcss';
import rootConfig from '../../tailwind.config.js';

const appConfig: Config = {
  ...rootConfig,
  content: ['./app/**/*.{ts,tsx}', '../../packages/**/*.{ts,tsx}'],
};

export default appConfig;
