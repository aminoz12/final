import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // Integrations
  integrations: [tailwind()],

  // Output as server for Node deployment
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),

  // Main site URL (used for absolute URLs)
  site: 'https://admin.mad2moi.store',
  base: '/',

  // Dev server settings
  server: {
    port: 4322,
    host: true,
  },

  // Vite configuration
  vite: {
    server: {
      allowedHosts: [
        'admin.mad2moi.store',
        'localhost',
        '127.0.0.1',
        '.onrender.com',
        '.ngrok-free.app',
        '.loca.lt',
        '.nip.io',
        '.xip.io',
        '.localhost.run',
        '.serveo.net',
      ],
      proxy: {
        '/ws/chat': {
          target: 'ws://localhost:4322',
          ws: true,
        },
      },
    },

    // Ensure static assets are served correctly
    publicDir: 'public',

    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            astro: ['astro'],
            tailwind: ['@tailwindcss/typography', '@tailwindcss/forms'],
          },
        },
      },
    },

    // SSR settings to bundle Tailwind properly
    ssr: {
      noExternal: [
        '@astrojs/tailwind',
        '@tailwindcss/typography',
        '@tailwindcss/forms',
      ],
    },
  },
});
