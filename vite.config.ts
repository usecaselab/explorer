import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function lastUpdatedPlugin(): Plugin {
  const virtualModuleId = 'virtual:last-updated';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'last-updated',
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) return;

      const dataDir = path.resolve(__dirname, 'public/data');
      const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.md'));
      const dates: Record<string, string> = {};

      for (const file of files) {
        const filePath = path.join(dataDir, file);
        const domainId = file.replace(/\.md$/, '');
        try {
          const date = execSync(`git log -1 --format="%ai" -- "${filePath}"`, { encoding: 'utf-8' }).trim();
          if (date) {
            const d = new Date(date);
            dates[domainId] = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          }
        } catch {
          // skip files with no git history
        }
      }

      return `export default ${JSON.stringify(dates)};`;
    }
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
      plugins: [react(), lastUpdatedPlugin()],
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
