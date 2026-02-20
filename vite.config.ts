import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { execSync } from 'child_process';

function buildIdeasPlugin() {
  let watcher: fs.FSWatcher | null = null;
  return {
    name: 'build-ideas',
    buildStart() {
      execSync('node scripts/build-ideas.js', { stdio: 'inherit' });
    },
    configureServer(server: any) {
      const dataDir = path.resolve(__dirname, 'public/data');
      watcher = fs.watch(dataDir, { recursive: false }, (_event, filename) => {
        if (filename && filename.endsWith('.md')) {
          execSync('node scripts/build-ideas.js', { stdio: 'inherit' });
          server.ws.send({ type: 'full-reload' });
        }
      });
    },
    closeWatcher() {
      watcher?.close();
    },
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [buildIdeasPlugin(), tailwindcss(), react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
