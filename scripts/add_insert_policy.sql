-- ============================================
-- PRMF Premium Rates - Add Insert Policy
-- ============================================
-- Run this in Supabase SQL Editor to allow data insertion
-- ============================================

-- Option 1: Create policy to allow insert with service role
CREATE POLICY "Allow service role insert" ON premium_rates
    FOR INSERT
    WITH CHECK (true);

-- Option 2: Or temporarily disable RLS for import (run this if Option 1 doesn't work)
-- ALTER TABLE premium_rates DISABLE ROW LEVEL SECURITY;

-- After import, you can re-enable RLS if you disabled it:
-- ALTER TABLE premium_rates ENABLE ROW LEVEL SECURITY;
