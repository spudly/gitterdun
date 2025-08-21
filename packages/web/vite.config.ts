import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-formatjs',
            {
              ast: true,
              removeDefaultMessage: false,
              overrideIdFn: (
                id: string | undefined,
                defaultMessage: string,
                filePath: string,
              ) => {
                try {
                  const rel = filePath.split('/src/')[1] ?? filePath;
                  const base = rel
                    .replace(/\.[tj]sx?$/, '')
                    .replace(/\//g, '.');
                  const slug = defaultMessage
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(?:^-|-$)/g, '')
                    .slice(0, 30);
                  return `${base}.${slug}`;
                } catch {
                  return id ?? defaultMessage;
                }
              },
            },
          ],
          ['@babel/plugin-transform-react-jsx', {runtime: 'automatic'}],
        ],
      },
    }),
  ],
  server: {port: 3001},
  build: {rollupOptions: {input: {main: 'index.html'}}},
});
