import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgrPlugin from 'vite-plugin-svgr';

import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { fileURLToPath, URL } from 'node:url';

const PORT = Number.parseInt(
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PORT) ||
    (typeof process !== 'undefined' && process.env?.VITE_PORT) ||
    '5173',
  10
);

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: PORT,
  },
  plugins: [
    devtools(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routeToken: 'layout',
    }),
    viteReact(),
    tailwindcss(),
    svgrPlugin({ svgrOptions: { icon: true } }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/utils/**/*.ts', 'src/components/ui/**/*.tsx'],
      exclude: ['src/utils/storage.ts', 'src/utils/index.ts'],
    },
  },
});
