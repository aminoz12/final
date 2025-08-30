// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  site: 'https://your-domain.com',
  integrations: [
    tailwind(),
    mdx(),
    sitemap()
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  },
  vite: {
    server: {
      allowedHosts: [
        'danialblogs-3.onrender.com',
        '.onrender.com', // Allows all onrender.com subdomains
        'localhost',
        '127.0.0.1',
        'faaf8915154d.ngrok-free.app',
        '.ngrok-free.app', // Allows all ngrok-free.app subdomains
        'admin.loca.lt', // Allow admin.loca.lt host
        'blog.loca.lt', // Allow blog.loca.lt host
        '.loca.lt', // Allow all loca.lt subdomains
        '.nip.io', // Allow nip.io hosts
        '.xip.io', // Allow xip.io hosts
        '.localhost.run', // Allow localhost.run hosts
        '.serveo.net' // Allow serveo.net hosts
      ]
    },
    optimizeDeps: {
      include: ['openai']
    }
  }
});
