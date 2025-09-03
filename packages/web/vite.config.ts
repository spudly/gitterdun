import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-formatjs', {ast: true, removeDefaultMessage: false}],
          ['@babel/plugin-transform-react-jsx', {runtime: 'automatic'}],
        ],
      },
    }),
  ],
  server: {port: 8001, strictPort: true},
  build: {outDir: 'dist', rollupOptions: {input: {main: 'index.html'}}},
});
