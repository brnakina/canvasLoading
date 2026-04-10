import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  if (mode === 'demo') {
    return {
      root: '.',
      server: {
        port: 5173,
      },
      build: {
        outDir: 'demo-dist',
        emptyOutDir: true,
      },
    };
  }

  return {
    build: {
      emptyOutDir: true,
      lib: {
        entry: resolve(__dirname, 'src/canvasLoading.js'),
        name: 'CanvasLoading',
        fileName: (format) => `canvasLoading.${format}.js`,
        formats: ['es', 'umd'],
      },
      rollupOptions: {
        output: {
          globals: {},
          exports: 'named',
        },
      },
    },
  };
});
