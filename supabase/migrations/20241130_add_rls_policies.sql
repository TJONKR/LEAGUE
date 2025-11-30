-- ================================================
-- RLS POLICIES FOR ALL TABLES
-- Run this migration in Supabase SQL Editor
-- ================================================

-- ================================================
-- PROFILES TABLE
-- ================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view profiles
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT USING (true);

-- Users can insert their own profile (during onboarding)
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL 
    AND (auth_id = auth.uid() OR auth_id IS NULL)
  );

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth_id = auth.uid())
  WITH CHECK (auth_id = auth.uid());

-- ================================================
-- HACKATHONS TABLE
-- ================================================
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;

-- Anyone can view hackathons
DROP POLICY IF EXISTS "Anyone can view hackathons" ON hackathons;
CREATE POLICY "Anyone can view hackathons" ON hackathons
  FOR SELECT USING (true);

-- Authenticated users can create hackathons
DROP POLICY IF EXISTS "Authenticated users can create hackathons" ON hackathons;
CREATE POLICY "Authenticated users can create hackathons" ON hackathons
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = organizer_id AND auth_id = auth.uid()
    )
  );

-- Organizers can update their hackathons
DROP POLICY IF EXISTS "Organizers can update their hackathons" ON hackathons;
CREATE POLICY "Organizers can update their hackathons" ON hackathons
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = organizer_id AND auth_id = auth.uid()
    )
  );

-- ================================================
-- HACKATHON_PARTICIPANTS TABLE
-- ================================================
ALTER TABLE hackathon_participants ENABLE ROW LEVEL SECURITY;

-- Anyone can view participants
DROP POLICY IF EXISTS "Anyone can view participants" ON hackathon_participants;
CREATE POLICY "Anyone can view participants" ON hackathon_participants
  FOR SELECT USING (true);

-- Users can join hackathons (insert themselves)
DROP POLICY IF EXISTS "Users can join hackathons" ON hackathon_participants;
CREATE POLICY "Users can join hackathons" ON hackathon_participants
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = user_id AND auth_id = auth.uid()
    )
  );

-- Users can leave hackathons (delete themselves)
DROP POLICY IF EXISTS "Users can leave hackathons" ON hackathon_participants;
CREATE POLICY "Users can leave hackathons" ON hackathon_participants
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = user_id AND auth_id = auth.uid()
    )
  );

-- ================================================
-- PROJECTS TABLE
-- ================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Anyone can view projects
DROP POLICY IF EXISTS "Anyone can view projects" ON projects;
CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

-- Authenticated users can create projects
DROP POLICY IF EXISTS "Authenticated users can create projects" ON projects;
CREATE POLICY "Authenticated users can create projects" ON projects
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = creator_id AND auth_id = auth.uid()
    )
  );

-- Creators can update their projects
DROP POLICY IF EXISTS "Creators can update their projects" ON projects;
CREATE POLICY "Creators can update their projects" ON projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = creator_id AND auth_id = auth.uid()
    )
  );

-- ================================================
-- PROJECT_MEMBERS TABLE
-- ================================================
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Anyone can view project members
DROP POLICY IF EXISTS "Anyone can view project members" ON project_members;
CREATE POLICY "Anyone can view project members" ON project_members
  FOR SELECT USING (true);

-- Project creators can add members
DROP POLICY IF EXISTS "Project creators can add members" ON project_members;
CREATE POLICY "Project creators can add members" ON project_members
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM projects p
      JOIN profiles pr ON p.creator_id = pr.id
      WHERE p.id = project_id AND pr.auth_id = auth.uid()
    )
  );

-- Project creators or the member themselves can remove members
DROP POLICY IF EXISTS "Can remove project members" ON project_members;
CREATE POLICY "Can remove project members" ON project_members
  FOR DELETE USING (
    -- Creator can remove anyone
    EXISTS (
      SELECT 1 FROM projects p
      JOIN profiles pr ON p.creator_id = pr.id
      WHERE p.id = project_id AND pr.auth_id = auth.uid()
    )
    OR
    -- Member can remove themselves
    EXISTS (
      SELECT 1 FROM profiles WHERE id = user_id AND auth_id = auth.uid()
    )
  );

-- ================================================
-- PROJECT_VOTES TABLE
-- ================================================
ALTER TABLE project_votes ENABLE ROW LEVEL SECURITY;

-- Anyone can view votes
DROP POLICY IF EXISTS "Anyone can view votes" ON project_votes;
CREATE POLICY "Anyone can view votes" ON project_votes
  FOR SELECT USING (true);

-- Authenticated users can vote (insert for themselves)
DROP POLICY IF EXISTS "Users can vote" ON project_votes;
CREATE POLICY "Users can vote" ON project_votes
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = user_id AND auth_id = auth.uid()
    )
  );

-- Users can remove their own votes
DROP POLICY IF EXISTS "Users can remove their votes" ON project_votes;
CREATE POLICY "Users can remove their votes" ON project_votes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = user_id AND auth_id = auth.uid()
    )
  );

-- ================================================
-- BOUNTIES TABLE
-- ================================================
ALTER TABLE bounties ENABLE ROW LEVEL SECURITY;

-- Anyone can view bounties
DROP POLICY IF EXISTS "Anyone can view bounties" ON bounties;
CREATE POLICY "Anyone can view bounties" ON bounties
  FOR SELECT USING (true);

-- Authenticated users can create bounties
DROP POLICY IF EXISTS "Authenticated users can create bounties" ON bounties;
CREATE POLICY "Authenticated users can create bounties" ON bounties
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = poster_id AND auth_id = auth.uid()
    )
  );

-- Posters can update their bounties
DROP POLICY IF EXISTS "Posters can update their bounties" ON bounties;
CREATE POLICY "Posters can update their bounties" ON bounties
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = poster_id AND auth_id = auth.uid()
    )
  );

-- ================================================
-- BOUNTY_SUBMISSIONS TABLE
-- ================================================
ALTER TABLE bounty_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can view submissions
DROP POLICY IF EXISTS "Anyone can view submissions" ON bounty_submissions;
CREATE POLICY "Anyone can view submissions" ON bounty_submissions
  FOR SELECT USING (true);

-- Authenticated users can submit to bounties
DROP POLICY IF EXISTS "Users can submit to bounties" ON bounty_submissions;
CREATE POLICY "Users can submit to bounties" ON bounty_submissions
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = submitted_by AND auth_id = auth.uid()
    )
  );

-- Submitters can update their submissions
DROP POLICY IF EXISTS "Submitters can update submissions" ON bounty_submissions;
CREATE POLICY "Submitters can update submissions" ON bounty_submissions
  FOR UPDATE USING (
    -- Submitter can update
    EXISTS (
      SELECT 1 FROM profiles WHERE id = submitted_by AND auth_id = auth.uid()
    )
    OR
    -- Bounty poster can update (for marking winner)
    EXISTS (
      SELECT 1 FROM bounties b
      JOIN profiles p ON b.poster_id = p.id
      WHERE b.id = bounty_id AND p.auth_id = auth.uid()
    )
  );

-- Submitters can delete their submissions
DROP POLICY IF EXISTS "Submitters can delete submissions" ON bounty_submissions;
CREATE POLICY "Submitters can delete submissions" ON bounty_submissions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = submitted_by AND auth_id = auth.uid()
    )
  );

-- ================================================
-- ACHIEVEMENTS TABLE
-- ================================================
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Anyone can view achievements
DROP POLICY IF EXISTS "Anyone can view achievements" ON achievements;
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (true);

-- Only system can insert achievements (via service role or triggers)
-- If you need users to earn achievements, add appropriate INSERT policy

-- ================================================
-- STORAGE POLICIES (for avatars and images buckets)
-- Run these in Supabase Dashboard > Storage > Policies
-- ================================================

-- For 'avatars' bucket:
-- CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
--   FOR SELECT USING (bucket_id = 'avatars');
-- 
-- CREATE POLICY "Users can upload their own avatar" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'avatars' 
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );
-- 
-- CREATE POLICY "Users can update their own avatar" ON storage.objects
--   FOR UPDATE USING (
--     bucket_id = 'avatars' 
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );

-- For 'images' bucket (project covers etc):
-- CREATE POLICY "Images are publicly accessible" ON storage.objects
--   FOR SELECT USING (bucket_id = 'images');
-- 
-- CREATE POLICY "Authenticated users can upload images" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'images' 
--     AND auth.uid() IS NOT NULL
--   );

-- ================================================
-- VERIFY POLICIES
-- ================================================
-- Run these to check policies are applied:
-- SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public';

