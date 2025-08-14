import '@testing-library/jest-dom';

// Provide default env used by src/lib/api.ts when running under Jest
process.env.VITE_API_ORIGIN =
  process.env.VITE_API_ORIGIN || 'http://localhost:3000';
