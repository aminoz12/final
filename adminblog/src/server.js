import { handler as ssrHandler } from './dist/server/entry.mjs';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4322;

// Serve static files from the client directory
app.use('/_astro', express.static(path.join(__dirname, 'dist/client/_astro')));
app.use('/uploads', express.static(path.join(__dirname, 'dist/client/uploads')));
app.use('/scripts', express.static(path.join(__dirname, 'dist/client/scripts')));
app.use('/images', express.static(path.join(__dirname, 'dist/client/images')));
app.use('/logo.png', express.static(path.join(__dirname, 'dist/client/logo.png')));

// Handle all other routes with Astro SSR
app.all('*', (req, res) => {
  ssrHandler(req, res);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'dist/client')}`);
});
