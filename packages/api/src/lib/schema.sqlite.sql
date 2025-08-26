-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user', -- 'admin' or 'user' (system-level; not family roles)
  points INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  expires_at datetime NOT NULL
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_resets (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  expires_at datetime NOT NULL,
  used INTEGER DEFAULT 0
);

-- Chores table
CREATE TABLE IF NOT EXISTS chores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  point_reward INTEGER NOT NULL DEFAULT 0,
  bonus_points INTEGER DEFAULT 0,
  penalty_points INTEGER DEFAULT 0,
  due_date datetime,
  recurrence_rule TEXT, -- iCalendar RFC 5545 format
  chore_type TEXT NOT NULL DEFAULT 'required', -- 'required' or 'bonus'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'approved'
  created_by INTEGER REFERENCES users (id),
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP
);

-- Chore assignments table
CREATE TABLE IF NOT EXISTS chore_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chore_id INTEGER REFERENCES chores (id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
  assigned_at datetime DEFAULT CURRENT_TIMESTAMP,
  completed_at datetime,
  approved_at datetime,
  approved_by INTEGER REFERENCES users (id),
  points_earned INTEGER DEFAULT 0,
  bonus_points_earned INTEGER DEFAULT 0,
  penalty_points_earned INTEGER DEFAULT 0,
  notes TEXT,
  UNIQUE (chore_id, user_id)
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_points INTEGER DEFAULT 0,
  current_points INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'abandoned'
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points_required INTEGER DEFAULT 0,
  streak_required INTEGER DEFAULT 0,
  created_at datetime DEFAULT CURRENT_TIMESTAMP
);

-- User badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
  badge_id INTEGER REFERENCES badges (id) ON DELETE CASCADE,
  earned_at datetime DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, badge_id)
);

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  is_active boolean DEFAULT 1,
  created_by INTEGER REFERENCES users (id),
  created_at datetime DEFAULT CURRENT_TIMESTAMP
);

-- User rewards table
CREATE TABLE IF NOT EXISTS user_rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
  reward_id INTEGER REFERENCES rewards (id) ON DELETE CASCADE,
  claimed_at datetime DEFAULT CURRENT_TIMESTAMP,
  claimed_by INTEGER REFERENCES users (id),
  UNIQUE (user_id, reward_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'chore_due', 'chore_completed', 'chore_approved', 'overdue', 'streak', 'badge', 'reward'
  is_read boolean DEFAULT 0,
  related_id INTEGER, -- ID of related chore, goal, etc.
  created_at datetime DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chores_status ON chores (status);

CREATE INDEX IF NOT EXISTS idx_chores_due_date ON chores (due_date);

CREATE INDEX IF NOT EXISTS idx_chore_assignments_user_id ON chore_assignments (user_id);

CREATE INDEX IF NOT EXISTS idx_chore_assignments_chore_id ON chore_assignments (chore_id);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals (user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications (is_read);

-- Families: group of users managed by a parent (owner)
CREATE TABLE IF NOT EXISTS families (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  owner_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at datetime DEFAULT CURRENT_TIMESTAMP
);

-- Membership of users within a family with family-specific roles
CREATE TABLE IF NOT EXISTS family_members (
  family_id INTEGER NOT NULL REFERENCES families (id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('parent', 'child')),
  PRIMARY KEY (family_id, user_id)
);

-- Invitations to join a family
CREATE TABLE IF NOT EXISTS family_invitations (
  token TEXT PRIMARY KEY,
  family_id INTEGER NOT NULL REFERENCES families (id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('parent', 'child')),
  invited_by INTEGER NOT NULL REFERENCES users (id),
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  expires_at datetime NOT NULL,
  accepted INTEGER DEFAULT 0
);

-- Insert default badges
INSERT OR IGNORE INTO
  badges (
    name,
    description,
    icon,
    points_required,
    streak_required
  )
VALUES
  (
    'First Steps',
    'Complete your first chore',
    '🎯',
    0,
    0
  ),
  (
    'Point Collector',
    'Earn your first 100 points',
    '⭐',
    100,
    0
  ),
  (
    'Streak Master',
    'Maintain a 7-day streak',
    '🔥',
    0,
    7
  ),
  ('Goal Getter', 'Complete 5 goals', '🎯', 0, 0),
  (
    'Chore Champion',
    'Complete 50 chores',
    '🏆',
    0,
    0
  );
