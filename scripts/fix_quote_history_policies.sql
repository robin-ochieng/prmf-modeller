-- Fix RLS Policies for quote_history
-- Run this in Supabase SQL Editor to update the policies

-- First, drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view own quotes" ON quote_history;
DROP POLICY IF EXISTS "Users can insert own quotes" ON quote_history;
DROP POLICY IF EXISTS "Users can insert quotes" ON quote_history;
DROP POLICY IF EXISTS "Allow anonymous quote inserts" ON quote_history;
DROP POLICY IF EXISTS "Authenticated users can insert quotes" ON quote_history;
DROP POLICY IF EXISTS "Service role has full access" ON quote_history;

-- Recreate policies

-- Policy: Users can only view their own quote history
CREATE POLICY "Users can view own quotes" ON quote_history
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Authenticated users can insert their own quotes
-- auth.uid() will be set when using an authenticated client
CREATE POLICY "Authenticated users can insert quotes" ON quote_history
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Allow service role full access (for analytics/admin)
CREATE POLICY "Service role has full access" ON quote_history
    FOR ALL
    USING (auth.role() = 'service_role');
