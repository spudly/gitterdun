/// <reference types="vite/client" />
// This file intentionally contains only type declarations; exclude from i18n extract
/* @formatjs-ignore-file */

// eslint-disable-next-line ts/consistent-type-definitions -- augmenting an existing interface
interface ImportMetaEnv {
  readonly MODE: 'development' | 'test' | 'production';
}

// eslint-disable-next-line ts/consistent-type-definitions -- augmenting an existing interface
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
