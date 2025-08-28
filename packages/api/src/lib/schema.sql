-- Users table
CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user', -- 'admin' or 'user'
  points INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Chores table
CREATE TABLE IF NOT EXISTS chores (
  id serial PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  point_reward INTEGER NOT NULL DEFAULT 0,
  bonus_points INTEGER DEFAULT 0,
  penalty_points INTEGER DEFAULT 0,
  start_date timestamp,
  due_date timestamp,
  recurrence_rule TEXT, -- iCalendar RFC 5545 format
  chore_type VARCHAR(20) NOT NULL DEFAULT 'required', -- 'required' or 'bonus'
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'approved'
  created_by INTEGER REFERENCES users (id),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Chore assignments table
CREATE TABLE IF NOT EXISTS chore_assignments (
  id serial PRIMARY KEY,
  chore_id INTEGER REFERENCES chores (id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
  assigned_at timestamp DEFAULT CURRENT_TIMESTAMP,
  completed_at timestamp,
  approved_at timestamp,
  approved_by INTEGER REFERENCES users (id),
  points_earned INTEGER DEFAULT 0,
  bonus_points_earned INTEGER DEFAULT 0,
  penalty_points_earned INTEGER DEFAULT 0,
  notes TEXT,
  UNIQUE (chore_id, user_id)
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id serial PRIMARY KEY,
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_points INTEGER DEFAULT 0,
  current_points INTEGER DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'completed', 'abandoned'
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id serial PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  points_required INTEGER DEFAULT 0,
  streak_required INTEGER DEFAULT 0,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- User badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id serial PRIMARY KEY,
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
  badge_id INTEGER REFERENCES badges (id) ON DELETE CASCADE,
  earned_at timestamp DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, badge_id)
);

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id serial PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  is_active boolean DEFAULT true,
  created_by INTEGER REFERENCES users (id),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- User rewards table
CREATE TABLE IF NOT EXISTS user_rewards (
  id serial PRIMARY KEY,
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
  reward_id INTEGER REFERENCES rewards (id) ON DELETE CASCADE,
  claimed_at timestamp DEFAULT CURRENT_TIMESTAMP,
  claimed_by INTEGER REFERENCES users (id),
  UNIQUE (user_id, reward_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id serial PRIMARY KEY,
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'chore_due', 'chore_completed', 'chore_approved', 'overdue', 'streak', 'badge', 'reward'
  is_read boolean DEFAULT false,
  related_id INTEGER, -- ID of related chore, goal, etc.
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chores_status ON chores (status);

CREATE INDEX IF NOT EXISTS idx_chores_due_date ON chores (due_date);

CREATE INDEX IF NOT EXISTS idx_chores_start_date ON chores (start_date);

CREATE INDEX IF NOT EXISTS idx_chore_assignments_user_id ON chore_assignments (user_id);

CREATE INDEX IF NOT EXISTS idx_chore_assignments_chore_id ON chore_assignments (chore_id);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals (user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications (is_read);

-- Insert default badges
INSERT INTO
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
  )
ON CONFLICT DO NOTHING;

-- Families: group of users managed by a parent (owner)
CREATE TABLE IF NOT EXISTS families (
  id serial PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  owner_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Membership of users within a family with family-specific roles
CREATE TABLE IF NOT EXISTS family_members (
  family_id INTEGER NOT NULL REFERENCES families (id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  role VARCHAR(10) NOT NULL CHECK (role IN ('parent', 'child')),
  PRIMARY KEY (family_id, user_id)
);

-- Enforce single-family per user (PostgreSQL)
CREATE UNIQUE INDEX IF NOT EXISTS ux_family_members_user_id ON family_members (user_id);
