-- ================================================
-- PEER HONORS SYSTEM
-- Run this migration in Supabase SQL Editor
-- ================================================

-- Create honor_type enum for peer recognition
CREATE TYPE honor_type AS ENUM (
  'great_teammate',
  'problem_solver', 
  'creative_genius',
  'clutch_player',
  'design_master'
);

-- Create peer_honors table for teammate recognition
CREATE TABLE peer_honors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  giver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  honor_type honor_type NOT NULL,
  points INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Each person can only give ONE honor per project
  CONSTRAINT unique_honor_per_project_per_giver UNIQUE (giver_id, project_id),
  
  -- Cannot honor yourself
  CONSTRAINT cannot_honor_self CHECK (giver_id != receiver_id)
);

-- Create indexes for efficient queries
CREATE INDEX idx_peer_honors_receiver ON peer_honors(receiver_id);
CREATE INDEX idx_peer_honors_project ON peer_honors(project_id);
CREATE INDEX idx_peer_honors_giver ON peer_honors(giver_id);

-- Enable RLS
ALTER TABLE peer_honors ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view honors
CREATE POLICY "Anyone can view honors" ON peer_honors
  FOR SELECT USING (true);

-- Only authenticated users who are project members can give honors
CREATE POLICY "Project members can give honors" ON peer_honors
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = giver_id AND auth_id = auth.uid()
    )
    AND (
      -- Giver must be creator or member of the project
      EXISTS (
        SELECT 1 FROM projects WHERE id = project_id AND creator_id = giver_id
      )
      OR EXISTS (
        SELECT 1 FROM project_members WHERE project_id = peer_honors.project_id AND user_id = giver_id
      )
    )
    AND (
      -- Receiver must be creator or member of the project
      EXISTS (
        SELECT 1 FROM projects WHERE id = project_id AND creator_id = receiver_id
      )
      OR EXISTS (
        SELECT 1 FROM project_members WHERE project_id = peer_honors.project_id AND user_id = receiver_id
      )
    )
  );

-- Function to update receiver's total_score when honor is given
CREATE OR REPLACE FUNCTION update_score_on_honor()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET total_score = COALESCE(total_score, 0) + NEW.points
  WHERE id = NEW.receiver_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update score
CREATE TRIGGER on_honor_given
  AFTER INSERT ON peer_honors
  FOR EACH ROW
  EXECUTE FUNCTION update_score_on_honor();

-- ================================================
-- Verify the migration worked
-- ================================================
-- SELECT * FROM pg_type WHERE typname = 'honor_type';
-- SELECT * FROM peer_honors LIMIT 1;

