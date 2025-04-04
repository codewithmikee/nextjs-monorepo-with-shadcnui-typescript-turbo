import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// A custom plugin to handle SPA routing in development
const spaFallbackPlugin = () => {
  return {
    name: 'spa-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Skip API requests
        if (req.url.startsWith('/api')) {
          return next();
        }
        
        // Skip static file requests that have file extensions
        if (req.url.match(/\.\w+$/)) {
          return next();
        }
        
        // For all other routes, serve index.html
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return fs.createReadStream(path.resolve(__dirname, 'index.html')).pipe(res);
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    spaFallbackPlugin()
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:5000',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
});