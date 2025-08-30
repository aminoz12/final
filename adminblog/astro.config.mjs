import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  site: 'https://mad2moi.store', // main website domain
  base: '/',

  server: {
    port: 4322,
    host: true,
    // Allow all hosts temporarily for Render, then restrict if needed
    allowedHosts: 'all',
  },

  vite: {
    server: {
      // Allowed hosts mainly for local dev
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        'mad2moi.store',
        'www.mad2moi.store',
        'admin.mad2moi.store',
        'danialblogs-3.onrender.com',
        '.onrender.com',
      ],
      proxy: {
        '/ws/chat': {
          target: 'ws://localhost:4322',
          ws: true,
        },
      },
    },
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
    ssr: {
      noExternal: ['@tailwindcss/typography', '@tailwindcss/forms'],
    },
  },
});
