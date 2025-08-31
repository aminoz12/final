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
  site: 'https://final-2-xuct.onrender.com',
  base: '/',

  server: {
    port: process.env.PORT || 4322,
    host: '0.0.0.0'
  },
  vite: {
    server: {
      allowedHosts: [
        'https://final-7-wflp.onrender.com',
        '.onrender.com', // Allows all onrender.com subdomains
        'a909b7338311.ngrok-free.app', // Allow ngrok host
        '.ngrok-free.app', // Allow all ngrok-free.app subdomains
        'mad2moi.store', // Allow loca.lt host
       
      ],
      proxy: {
        '/ws/chat': {
          target: 'ws://localhost:4322',
          ws: true
        }
      }
    },
    // Ensure static files are served correctly
    publicDir: 'public',
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'astro': ['astro'],
            'tailwind': ['@tailwindcss/typography', '@tailwindcss/forms']
          }
        }
      }
    },
    ssr: {
      noExternal: ['@tailwindcss/typography', '@tailwindcss/forms']
    }
  }
});
