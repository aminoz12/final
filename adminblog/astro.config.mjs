import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      // Ensure Tailwind is properly configured
      config: { path: './tailwind.config.js' }
    })
  ],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  build: {
    assets: '_astro',
    inlineStylesheets: 'auto'
  },
  site: 'https://admin.mad2moi.store',
  base: '/',

  server: {
    port: process.env.PORT || 4322,
    host: '0.0.0.0'
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
        '.serveo.net', // Allow serveo.net hosts
        'admin.mad2moi.store' // Allow your actual domain
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
            'astro': ['astro']
          }
        }
      }
    }
  }
});
