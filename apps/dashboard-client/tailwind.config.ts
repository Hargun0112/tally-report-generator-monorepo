import type { Config } from 'tailwindcss';
import sharedConfig from '@trg_package/config-tailwind';

const config: Pick<Config, 'prefix' | 'presets' | 'content'> = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [sharedConfig],
};

export default config;
