import type {ProcessOptions, Plugin} from 'postcss';

type PostcssConfig = {
  plugins: Record<string, Plugin | object>;
} & Partial<ProcessOptions>;

const config: PostcssConfig = {
  plugins: {'@tailwindcss/postcss': {}, autoprefixer: {}},
};

export default config;
