// Ambient module shims for ESLint plugins without type definitions

declare module 'eslint-plugin-eslint-comments' {
  const plugin: any;
  export default plugin;
}
