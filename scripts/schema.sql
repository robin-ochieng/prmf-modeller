-- ============================================
-- PRMF Premium Rates Database Schema
-- Project: PRMF-Modeller
-- ============================================
-- Run this script in Supabase SQL Editor to create the database schema
-- ============================================

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS premium_rates;

-- Create the premium_rates table
CREATE TABLE premium_rates (
    id SERIAL PRIMARY KEY,
    age INTEGER NOT NULL,
    family_size VARCHAR(10) NOT NULL,
    payment_type VARCHAR(10) NOT NULL,
    option_1 DECIMAL(15, 2) NOT NULL,
    option_2 DECIMAL(15, 2) NOT NULL,
    option_3 DECIMAL(15, 2) NOT NULL,
    option_4 DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    
    -- Constraints
    CONSTRAINT chk_age CHECK (age >= 18 AND age <= 90),
    CONSTRAINT chk_family_size CHECK (family_size IN ('M', 'M+1')),
    CONSTRAINT chk_payment_type CHECK (payment_type IN ('LUMPSUM', 'ANNUAL')),
    CONSTRAINT unique_age_family UNIQUE (age, family_size)
);

-- Create index for faster lookups
CREATE INDEX idx_premium_lookup ON premium_rates(age, family_size);
CREATE INDEX idx_payment_type ON premium_rates(payment_type);

-- Add comments for documentation
COMMENT ON TABLE premium_rates IS 'Premium rate table for PRMF medical insurance calculator';
COMMENT ON COLUMN premium_rates.age IS 'Member age (18-90)';
COMMENT ON COLUMN premium_rates.family_size IS 'M = Principal Only, M+1 = Principal + Spouse';
COMMENT ON COLUMN premium_rates.payment_type IS 'LUMPSUM for ages 61-90, ANNUAL for ages 18-60';
COMMENT ON COLUMN premium_rates.option_1 IS 'Premium amount for Option I in KES';
COMMENT ON COLUMN premium_rates.option_2 IS 'Premium amount for Option II in KES';
COMMENT ON COLUMN premium_rates.option_3 IS 'Premium amount for Option III in KES';
COMMENT ON COLUMN premium_rates.option_4 IS 'Premium amount for Option IV in KES';

-- Enable Row Level Security (RLS)
ALTER TABLE premium_rates ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON premium_rates
    FOR SELECT
    USING (true);

-- Verify table creation
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'premium_rates'
ORDER BY ordinal_position;
