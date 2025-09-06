// Re-export from focused modules for backward compatibility
export {
  validateCreateGoalData,
  validateGoalId,
  validateUpdateGoalRequest,
} from './goalValidation.js';

export {
  createGoalInDatabase,
  fetchGoalById,
  checkGoalExists,
  deleteGoalFromDatabase,
} from './goalCrud.js';

export {buildGoalUpdateQuery, executeGoalUpdate} from './goalUpdates.js';
