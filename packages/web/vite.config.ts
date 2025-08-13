import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'path';

export default defineConfig({
  plugins: [
    react({
      // Enable React Compiler
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', {runtime: 'automatic'}],
        ],
      },
    }),
  ],
  resolve: {alias: {'@': resolve(__dirname, './src')}},
  server: {
    port: 3001,
    proxy: {'/api': {target: 'http://localhost:3000', changeOrigin: true}},
  },
  ssr: {
    // SSR-specific configuration
    noExternal: ['@tanstack/react-query'],
  },
  build: {rollupOptions: {input: {main: resolve(__dirname, 'index.html')}}},
});
