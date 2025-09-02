// API utility functions using native fetch
// Prefer hitting the API server directly rather than relying on the Vite proxy
// Note: Avoid direct `import.meta` so tests (CJS) can parse this file.

// Re-export all API modules
export {api} from './apiCore';
export {ApiError} from './apiUtils';
export {authApi} from './authApi';
export {choresApi} from './choresApi';
export {goalsApi} from './goalsApi';
export {leaderboardApi, familiesApi, invitationsApi} from './familiesApi';
export {usersApi} from './usersApi';
export {choreInstancesApi} from './choreInstancesApi';

// Re-export types for convenience
