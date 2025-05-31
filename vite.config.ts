import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import type { AcceptedPlugin } from 'postcss';
import type { PluginOption } from 'vite';

// Import lovable-tagger only in dev mode
let tagger: (() => PluginOption) | undefined = undefined;
if (process.env.NODE_ENV === 'development') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    tagger = require('lovable-tagger').componentTagger;
  } catch {
    // ignore if not available
  }
}

export default defineConfig(({ mode }) => {
  return {
    server: {
      host: '::',
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && tagger ? tagger() : undefined,
      mode === 'analyze' ? visualizer({ open: false }) : undefined,
    ].filter(Boolean) as PluginOption[],
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()] as AcceptedPlugin[],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
