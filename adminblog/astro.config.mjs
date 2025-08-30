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
    port: 4322,
    host: true
  },
  vite: {
    server: {
      allowedHosts: [
        'danialblogs-3.onrender.com',
        '.onrender.com', // Allows all onrender.com subdomains
        'localhost',
        '127.0.0.1',
        'a909b7338311.ngrok-free.app', // Allow ngrok host
        '.ngrok-free.app', // Allow all ngrok-free.app subdomains
        'admin.loca.lt', // Allow loca.lt host
        'blog.loca.lt', // Allow blog.loca.lt host
        '.loca.lt', // Allow all loca.lt subdomains
        '.nip.io', // Allow nip.io hosts
        '.xip.io', // Allow xip.io hosts
        '.localhost.run', // Allow localhost.run hosts
        '.serveo.net' // Allow serveo.net hosts
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
