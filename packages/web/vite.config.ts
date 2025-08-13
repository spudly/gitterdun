import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import istanbulVite from 'vite-plugin-istanbul';
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
      // Conditionally instrument code via Babel Istanbul when coverage is enabled
      ...(process.env['VITE_COVERAGE']
        ? {
            babel: {
              plugins: [
                ['@babel/plugin-transform-react-jsx', {runtime: 'automatic'}],
                ['istanbul', {include: ['src/**/*.ts', 'src/**/*.tsx']}],
              ],
            },
          }
        : {}),
    }),
    // Add Vite Istanbul plugin when coverage is enabled
    istanbulVite({
      include: ['src/**/*'],
      exclude: ['tests/**/*', 'node_modules/**/*'],
      requireEnv: false,
    }) as unknown as any,
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
