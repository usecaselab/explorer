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
          // react-aria subpath aliases — Vite 6 strict exports compat for @privy-io/react-auth
          'react-aria/FocusScope': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/FocusScope.js'),
          'react-aria/FocusRing': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/FocusRing.js'),
          'react-aria/useFocusRing': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/useFocusRing.js'),
          'react-aria/useFocusable': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/useFocusable.js'),
          'react-aria/Focusable': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/Focusable.js'),
          'react-aria/private/focus/FocusScope': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/private/focus/FocusScope.js'),
          'react-aria/private/focus/useHasTabbableChild': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/private/focus/useHasTabbableChild.js'),
          'react-aria/private/focus/virtualFocus': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/private/focus/virtualFocus.js'),
          'react-aria/private/utils/isFocusable': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/private/utils/isFocusable.js'),
          'react-aria/private/interactions/useFocusable': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/private/interactions/useFocusable.js'),
          'react-aria/private/interactions/focusSafely': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/private/interactions/focusSafely.js'),
          'react-aria/Pressable': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/Pressable.js'),
          'react-aria/useFocus': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/useFocus.js'),
          'react-aria/useFocusVisible': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/useFocusVisible.js'),
          'react-aria/useFocusWithin': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/useFocusWithin.js'),
          'react-aria/useHover': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/useHover.js'),
          'react-aria/useInteractOutside': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/useInteractOutside.js'),
          'react-aria/useKeyboard': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/useKeyboard.js'),
          'react-aria/useLongPress': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/useLongPress.js'),
          'react-aria/useMove': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/useMove.js'),
          'react-aria/usePress': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/usePress.js'),
          'react-aria/private/interactions/PressResponder': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/private/interactions/PressResponder.js'),
          'react-aria/private/interactions/useFocusVisible': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/private/interactions/useFocusVisible.js'),
          'react-aria/private/interactions/useScrollWheel': path.resolve(__dirname, 'node_modules/react-aria/dist/exports/private/interactions/useScrollWheel.js'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              three: ['three', '@react-three/fiber', '@react-three/drei'],
              privy: ['@privy-io/react-auth'],
              viem: ['viem'],
            }
          }
        }
      }
    };
});
