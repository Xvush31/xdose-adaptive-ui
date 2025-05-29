import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(async ({ mode }) => {
  let tagger;
  if (mode === 'development') {
    tagger = (await import('lovable-tagger')).componentTagger;
  }
  return {
    server: {
      host: '::',
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && tagger && tagger(),
      mode === 'analyze' && visualizer({ open: false }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
