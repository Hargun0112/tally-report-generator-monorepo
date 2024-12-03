import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from 'tailwindcss';

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        $: path.resolve(__dirname, '../../packages/vite/src')
      }
    },
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
    server: {
      port: Number(process.env.VITE_PORT),
      host: true
    },
    preview: {
      port: Number(process.env.VITE_PORT),
      host: true
    }
  });
};
