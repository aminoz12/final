import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),

  server: {
    port: 4322,
    host: true
  },
  vite: {
    server: {
      allowedHosts: [
        'admin.mad2moi.store',
        'danialblogs-3.onrender.com',
        '.onrender.com', // Allows all onrender.com subdomains
        'localhost',
        ],
      proxy: {
        '/ws/chat': {
          target: 'ws://localhost:4322',
          ws: true
        }
      }
    },
    // Ensure static files are served correctly
    publicDir: 'public'
  }
});
