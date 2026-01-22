-- ============================================
-- PRMF Premium Rates - Add Full Access Policies
-- ============================================
-- Run this in Supabase SQL Editor to allow data operations
-- ============================================

-- Drop existing policies first (if they exist)
DROP POLICY IF EXISTS "Allow public read access" ON premium_rates;
DROP POLICY IF EXISTS "Allow service role insert" ON premium_rates;
DROP POLICY IF EXISTS "Allow service role update" ON premium_rates;
DROP POLICY IF EXISTS "Allow service role delete" ON premium_rates;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON premium_rates
    FOR SELECT
    USING (true);

-- Create policy to allow insert with service role
CREATE POLICY "Allow service role insert" ON premium_rates
    FOR INSERT
    WITH CHECK (true);

-- Create policy to allow update with service role
CREATE POLICY "Allow service role update" ON premium_rates
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Create policy to allow delete with service role
CREATE POLICY "Allow service role delete" ON premium_rates
    FOR DELETE
    USING (true);

-- Verify policies
SELECT * FROM pg_policies WHERE tablename = 'premium_rates';
