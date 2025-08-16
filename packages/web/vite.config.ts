import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', {runtime: 'automatic'}],
        ],
      },
    }),
  ],
  server: {port: 3001},
  build: {rollupOptions: {input: {main: 'index.html'}}},
});
