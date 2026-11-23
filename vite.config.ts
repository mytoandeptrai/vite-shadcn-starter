import { loadEnv, type Plugin } from 'vite';
import { defineConfig } from 'vitest/config';
import { devtools } from '@tanstack/devtools-vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgrPlugin from 'vite-plugin-svgr';

import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { fileURLToPath, URL } from 'node:url';
import { buildHeadTags, buildManifest, buildRobotsTxt, buildSitemapXml, resolveSiteUrl } from './src/utils/seo';

const PORT = Number.parseInt(
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PORT) ||
    (typeof process !== 'undefined' && process.env?.VITE_PORT) ||
    '5173',
  10
);

/**
 * Writes the search and share metadata into index.html and generates robots.txt, sitemap.xml and the
 * web manifest, all from src/constant/site.const.ts and the site URL known at build time.
 */
function seo(): Plugin {
  let siteUrl = '';
  let googleSiteVerification: string | undefined;
  const files = (): Record<string, { type: string; body: string }> => ({
    'robots.txt': { type: 'text/plain; charset=utf-8', body: buildRobotsTxt(siteUrl) },
    'sitemap.xml': { type: 'application/xml; charset=utf-8', body: buildSitemapXml(siteUrl, new Date()) },
    'manifest.webmanifest': { type: 'application/manifest+json; charset=utf-8', body: buildManifest() },
  });

  return {
    name: 'seo',
    configResolved(config) {
      const env = { ...process.env, ...loadEnv(config.mode, config.envDir || config.root, 'VITE_') };
      siteUrl = resolveSiteUrl(env);
      googleSiteVerification = env.VITE_GOOGLE_SITE_VERIFICATION;
    },
    transformIndexHtml: () => buildHeadTags(siteUrl, googleSiteVerification),
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const file = files()[(req.url ?? '').split('?')[0].slice(1)];
        if (!file) return next();
        res.setHeader('Content-Type', file.type);
        res.end(file.body);
      });
    },
    generateBundle() {
      for (const [fileName, file] of Object.entries(files())) {
        this.emitFile({ type: 'asset', fileName, source: file.body });
      }
    },
  };
}

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
    seo(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // TanStack Router's autoCodeSplitting already splits code per-route; this
    // splits the remaining shared vendor code (always needed on every route)
    // out of the single ~800kB entry chunk into a few cacheable pieces
    // instead of one large bundle.
    // https://rolldown.rs/in-depth/manual-code-splitting
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-react',
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 3,
            },
            {
              name: 'vendor-tanstack',
              test: /node_modules[\\/]@tanstack[\\/]/,
              priority: 3,
            },
            {
              name: 'vendor-radix',
              test: /node_modules[\\/]@radix-ui[\\/]/,
              priority: 3,
            },
            {
              name: 'vendor-i18n',
              test: /node_modules[\\/](i18next|react-i18next)/,
              priority: 3,
            },
            {
              name: 'vendor-charts',
              test: /node_modules[\\/](recharts|d3-|victory-vendor|internmap|delaunator|robust-predicates)/,
              priority: 3,
            },
            {
              name: 'vendor-ethers',
              test: /node_modules[\\/](ethers|@noble[\\/]|@adraffy[\\/]|aes-js)/,
              priority: 3,
            },
            {
              name: 'vendor-motion',
              test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
              priority: 3,
            },
            {
              name: 'vendor-forms',
              test: /node_modules[\\/](react-hook-form|zod|@hookform)[\\/]/,
              priority: 3,
            },
            {
              name: 'vendor-icons',
              test: /node_modules[\\/](lucide-react)[\\/]/,
              priority: 3,
            },
            {
              name: 'vendor-misc',
              // The 3D engine and Rapier WASM stay out, so only the lazy driving-sim scene loads them.
              test: /node_modules(?!.*[\\/](three|three-stdlib|three-mesh-bvh|@react-three|@dimforge)[\\/])/,
              priority: 1,
            },
          ],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/utils/**/*.ts', 'src/components/ui/**/*.tsx'],
      exclude: ['src/utils/storage.ts', 'src/utils/index.ts'],
    },
  },
});
