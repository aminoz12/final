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
  site: 'https://mad2moi.store', // ✅ your main domain
  base: '/',

  server: {
    port: 4322,
    host: true,
    // ✅ allow custom domains in production
    allowedHosts: [
      'mad2moi.store',
      'www.mad2moi.store',
      'admin.mad2moi.store',
      'danialblogs-3.onrender.com',
      'localhost',
      '127.0.0.1'
    ]
  },

  vite: {
    server: {
      allowedHosts: [
        'mad2moi.store',
        'www.mad2moi.store',
        'admin.mad2moi.store',
        'danialblogs-3.onrender.com',
        'localhost',
        '127.0.0.1',
        '.onrender.com', // Allows all onrender.com subdomains
        'a909b7338311.ngrok-free.app', 
        '.ngrok-free.app',
        'admin.loca.lt',
        'blog.loca.lt',
        '.loca.lt',
        '.nip.io',
        '.xip.io',
        '.localhost.run',
        '.serveo.net'
      ],
      proxy: {
        '/ws/chat': {
          target: 'ws://localhost:4322',
          ws: true
        }
      }
    },
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
