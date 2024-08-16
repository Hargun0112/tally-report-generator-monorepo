import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/loaders/index.ts', 'src/middlewares/index.ts'],
  dts: true,
  format: ['esm', 'cjs'],
  clean: true,
  splitting: true,
  sourcemap: true
});
