-- Quote History Table
-- Stores all premium calculations for analytics and user history

-- Create the quote_history table
CREATE TABLE IF NOT EXISTS quote_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    age INTEGER NOT NULL CHECK (age >= 18 AND age <= 90),
    benefit_option VARCHAR(10) NOT NULL CHECK (benefit_option IN ('option_1', 'option_2', 'option_3', 'option_4')),
    family_size VARCHAR(5) NOT NULL CHECK (family_size IN ('M', 'M+1')),
    premium_amount DECIMAL(12, 2) NOT NULL,
    payment_type VARCHAR(10) NOT NULL CHECK (payment_type IN ('ANNUAL', 'LUMPSUM')),
    benefit_name VARCHAR(100), -- e.g., "Option 1 - Kshs 300,000"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Optional: IP address for analytics (anonymized)
    ip_hash VARCHAR(64),
    
    -- Optional: User agent for device analytics
    user_agent TEXT
);

-- Create index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_quote_history_user_id ON quote_history(user_id);

-- Create index for analytics queries by date
CREATE INDEX IF NOT EXISTS idx_quote_history_created_at ON quote_history(created_at);

-- Create index for analytics by age groups
CREATE INDEX IF NOT EXISTS idx_quote_history_age ON quote_history(age);

-- Enable Row Level Security
ALTER TABLE quote_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own quote history
CREATE POLICY "Users can view own quotes" ON quote_history
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own quotes
CREATE POLICY "Users can insert own quotes" ON quote_history
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Allow service role full access (for analytics)
CREATE POLICY "Service role has full access" ON quote_history
    FOR ALL
    USING (auth.role() = 'service_role');

-- Optional: Allow anonymous inserts for non-authenticated users (analytics only)
-- Uncomment if you want to track anonymous quotes
-- CREATE POLICY "Allow anonymous inserts" ON quote_history
--     FOR INSERT
--     WITH CHECK (user_id IS NULL);

COMMENT ON TABLE quote_history IS 'Stores premium calculation history for users and analytics';
COMMENT ON COLUMN quote_history.user_id IS 'Reference to authenticated user, NULL for anonymous quotes';
COMMENT ON COLUMN quote_history.benefit_name IS 'Human-readable benefit option name for display';
COMMENT ON COLUMN quote_history.ip_hash IS 'Hashed IP address for anonymous analytics';
