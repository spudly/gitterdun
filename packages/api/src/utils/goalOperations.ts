// Re-export from focused modules for backward compatibility
export {
  validateCreateGoalData,
  validateGoalId,
  validateUpdateGoalRequest,
} from './goalValidation';

export {
  createGoalInDatabase,
  fetchGoalById,
  checkGoalExists,
  deleteGoalFromDatabase,
} from './goalCrud';

export {buildGoalUpdateQuery, executeGoalUpdate} from './goalUpdates';
