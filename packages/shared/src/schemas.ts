import {z} from 'zod';

// User schemas
export const UserSchema = z.object({
  id: z.number(),
  username: z.string().min(1).max(50),
  email: z.email().max(255),
  role: z.enum(['admin', 'user']),
  points: z.number().int().min(0),
  streak_count: z.number().int().min(0),
  // Accept SQLite DATETIME strings (e.g., 'YYYY-MM-DD HH:MM:SS') as well as ISO
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateUserSchema = z.object({
  username: z.string().min(1).max(50),
  email: z.email().max(255),
  password: z.string().min(6),
  role: z.enum(['admin', 'user']).optional().default('user'),
});

export const UpdateUserSchema = z.object({
  username: z.string().min(1).max(50).optional(),
  email: z.email().max(255).optional(),
  points: z.number().int().min(0).optional(),
  streak_count: z.number().int().min(0).optional(),
});

export const LoginSchema = z.object({email: z.email(), password: z.string().min(1)});

// Auth helper schemas
export const ForgotPasswordRequestSchema = z.object({email: z.email()});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
});

// Family schemas
export const FamilySchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(100),
  owner_id: z.number(),
  // Accept SQLite DATETIME strings (e.g., 'YYYY-MM-DD HH:MM:SS')
  // Use plain string to be lenient for server responses
  created_at: z.string(),
});

export const CreateFamilySchema = z.object({name: z.string().min(1).max(100)});

export const FamilyMemberSchema = z.object({
  family_id: z.number(),
  user_id: z.number(),
  role: z.enum(['parent', 'child']),
  username: z.string(),
  email: z.email(),
});

export const CreateChildSchema = z.object({
  username: z.string().min(1).max(50),
  email: z.email().max(255),
  password: z.string().min(6),
});

export const CreateInvitationSchema = z.object({
  email: z.email().max(255),
  role: z.enum(['parent', 'child']),
});

export const AcceptInvitationSchema = z.object({
  token: z.string().min(1),
  username: z.string().min(1).max(50),
  password: z.string().min(6),
});

// Chore schemas
export const ChoreSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  point_reward: z.number().int().min(0),
  bonus_points: z.number().int().min(0).default(0),
  penalty_points: z.number().int().min(0).default(0),
  due_date: z.iso.datetime().optional(),
  recurrence_rule: z.string().optional(),
  chore_type: z
    .string()
    .refine(val => ['required', 'bonus'].includes(val), {
      message: 'chore_type must be either "required" or "bonus"',
    }),
  status: z
    .string()
    .refine(val => ['pending', 'completed', 'approved'].includes(val), {
      message: 'status must be either "pending", "completed", or "approved"',
    }),
  created_by: z.number(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

// Chore with username for API responses
export const ChoreWithUsernameSchema = ChoreSchema.extend({
  created_by_username: z.string().optional(),
});

export const CreateChoreSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  point_reward: z.number().int().min(0),
  bonus_points: z.number().int().min(0).optional().default(0),
  penalty_points: z.number().int().min(0).optional().default(0),
  due_date: z.iso.datetime().optional(),
  recurrence_rule: z.string().optional(),
  chore_type: z
    .string()
    .refine(val => ['required', 'bonus'].includes(val), {
      message: 'chore_type must be either "required" or "bonus"',
    })
    .default('required'),
  assigned_users: z.array(z.number()).optional(),
});

export const UpdateChoreSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  point_reward: z.number().int().min(0).optional(),
  bonus_points: z.number().int().min(0).optional(),
  penalty_points: z.number().int().min(0).optional(),
  due_date: z.iso.datetime().optional(),
  recurrence_rule: z.string().optional(),
  chore_type: z
    .string()
    .refine(val => ['required', 'bonus'].includes(val), {
      message: 'chore_type must be either "required" or "bonus"',
    })
    .optional(),
  status: z
    .string()
    .refine(val => ['pending', 'completed', 'approved'].includes(val), {
      message: 'status must be either "pending", "completed", or "approved"',
    })
    .optional(),
});

// Chore assignment schemas
export const ChoreAssignmentSchema = z.object({
  id: z.number(),
  chore_id: z.number(),
  user_id: z.number(),
  assigned_at: z.iso.datetime(),
  completed_at: z.iso.datetime().optional(),
  approved_at: z.iso.datetime().optional(),
  approved_by: z.number().optional(),
  points_earned: z.number().int().min(0).default(0),
  bonus_points_earned: z.number().int().min(0).default(0),
  penalty_points_earned: z.number().int().min(0).default(0),
  notes: z.string().optional(),
});

export const UpdateChoreAssignmentSchema = z.object({
  completed_at: z.iso.datetime().optional(),
  approved_at: z.iso.datetime().optional(),
  approved_by: z.number().optional(),
  points_earned: z.number().int().min(0).optional(),
  bonus_points_earned: z.number().int().min(0).optional(),
  penalty_points_earned: z.number().int().min(0).optional(),
  notes: z.string().optional(),
});

// Goal schemas
export const GoalSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  target_points: z.number().int().min(0),
  current_points: z.number().int().min(0).default(0),
  status: z
    .string()
    .refine(val => ['active', 'completed', 'abandoned'].includes(val), {
      message: 'status must be either "active", "completed", or "abandoned"',
    }),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const CreateGoalSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  target_points: z.number().int().min(0),
});

export const UpdateGoalSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  target_points: z.number().int().min(0).optional(),
  current_points: z.number().int().min(0).optional(),
  status: z.enum(['active', 'completed', 'abandoned']).optional(),
});

// Badge schemas
export const BadgeSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  icon: z.string().optional(),
  points_required: z.number().int().min(0).default(0),
  streak_required: z.number().int().min(0).default(0),
  created_at: z.iso.datetime(),
});

// Reward schemas
export const RewardSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  points_required: z.number().int().min(0),
  is_active: z.boolean().default(true),
  created_by: z.number(),
  created_at: z.iso.datetime(),
});

export const CreateRewardSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  points_required: z.number().int().min(0),
});

// Notification schemas
export const NotificationSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string().min(1).max(255),
  message: z.string().min(1),
  type: z.enum([
    'chore_due',
    'chore_completed',
    'chore_approved',
    'overdue',
    'streak',
    'badge',
    'reward',
  ]),
  is_read: z.boolean().default(false),
  related_id: z.number().optional(),
  created_at: z.iso.datetime(),
});

// Query parameter schemas
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const ChoreQuerySchema = PaginationSchema.extend({
  status: z.enum(['pending', 'completed', 'approved']).optional(),
  chore_type: z.enum(['required', 'bonus']).optional(),
  user_id: z.coerce.number().int().optional(),
});

export const GoalQuerySchema = PaginationSchema.extend({
  status: z.enum(['active', 'completed', 'abandoned']).optional(),
  user_id: z.coerce.number().int().optional(),
});

// Response schemas
export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

export const PaginatedResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  });

// Utility/minor schemas
export const CountRowSchema = z.object({count: z.number()});
export const CompleteChoreBodySchema = z.object({
  userId: z.coerce.number().int().min(1),
  notes: z.string().optional(),
});

// Common param/query schemas
export const IdParamSchema = z.object({id: z.coerce.number().int().min(1)});
export const FamilyIdParamSchema = z.object({
  familyId: z.coerce.number().int().min(1),
});

// Database row schemas (runtime-validated parsing for raw DB results)
export const SessionRowSchema = z.object({
  user_id: z.number(),
  expires_at: z.string(),
});

export const IdRowSchema = z.object({id: z.number()});

export const RoleRowSchema = z.object({role: z.enum(['parent', 'child'])});

export const PasswordResetRowSchema = z.object({
  token: z.string(),
  user_id: z.number(),
  expires_at: z.string(),
  used: z.number(),
});

export const FamilyInvitationRowSchema = z.object({
  token: z.string(),
  family_id: z.number(),
  email: z.email(),
  role: z.enum(['parent', 'child']),
  invited_by: z.number(),
  expires_at: z.string(),
  accepted: z.number(),
});

export const UserPasswordHashRowSchema = z.object({
  id: z.number(),
  password_hash: z.string(),
});

export const UserWithPasswordRowSchema = z.object({
  id: z.number(),
  username: z.string().min(1).max(50),
  email: z.email().max(255),
  password_hash: z.string(),
  role: z.enum(['admin', 'user']),
  points: z.number().int().min(0),
  streak_count: z.number().int().min(0),
  created_at: z.string(),
  updated_at: z.string(),
});

// Leaderboard row from aggregated query
export const LeaderboardRowSchema = z.object({
  id: z.number(),
  username: z.string(),
  points: z.number(),
  streak_count: z.number(),
  badges_earned: z.number(),
  chores_completed: z.number(),
});

// Leaderboard query and entry schemas
export const LeaderboardQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['points', 'streak']).default('points'),
});

export const LeaderboardEntrySchema = z.object({
  rank: z.number(),
  id: z.number(),
  username: z.string(),
  points: z.number(),
  streak_count: z.number(),
  badges_earned: z.number(),
  chores_completed: z.number(),
});

// Leaderboard API response schema
export const LeaderboardResponseSchema = z
  .object({
    leaderboard: z.array(LeaderboardEntrySchema),
    sortBy: z.string(),
    totalUsers: z.number(),
  })
  .loose();

// Type exports
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordSchema>;
export type Family = z.infer<typeof FamilySchema>;
export type CreateFamily = z.infer<typeof CreateFamilySchema>;
export type FamilyMember = z.infer<typeof FamilyMemberSchema>;
export type CreateChild = z.infer<typeof CreateChildSchema>;
export type CreateInvitation = z.infer<typeof CreateInvitationSchema>;
export type AcceptInvitation = z.infer<typeof AcceptInvitationSchema>;

export type Chore = z.infer<typeof ChoreSchema>;
export type ChoreWithUsername = z.infer<typeof ChoreWithUsernameSchema>;
export type CreateChore = z.infer<typeof CreateChoreSchema>;
export type UpdateChore = z.infer<typeof UpdateChoreSchema>;

export type ChoreAssignment = z.infer<typeof ChoreAssignmentSchema>;
export type UpdateChoreAssignment = z.infer<typeof UpdateChoreAssignmentSchema>;

export type Goal = z.infer<typeof GoalSchema>;
export type CreateGoal = z.infer<typeof CreateGoalSchema>;
export type UpdateGoal = z.infer<typeof UpdateGoalSchema>;

export type Badge = z.infer<typeof BadgeSchema>;
export type Reward = z.infer<typeof RewardSchema>;
export type CreateReward = z.infer<typeof CreateRewardSchema>;
export type Notification = z.infer<typeof NotificationSchema>;

export type Pagination = z.infer<typeof PaginationSchema>;
export type ChoreQuery = z.infer<typeof ChoreQuerySchema>;
export type GoalQuery = z.infer<typeof GoalQuerySchema>;
export type LeaderboardResponse = z.infer<typeof LeaderboardResponseSchema>;
