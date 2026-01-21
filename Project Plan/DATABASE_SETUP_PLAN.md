# Database Setup Plan - Importing Rates.xlsx to Supabase

## 📋 Overview

This document outlines the step-by-step process to migrate premium rate data from `Rates.xlsx` to Supabase PostgreSQL database.

**Source File:** `Rates.xlsx`  
**Target:** Supabase PostgreSQL Database  
**Date:** January 21, 2026

---

## 📊 Source Data Analysis

### Current Excel Structure

The `Rates.xlsx` file contains one sheet "Contribution Amounts" with the following structure:

| Section | Age Range | Family Size | Columns |
|---------|-----------|-------------|---------|
| Retirees' Lumpsum Payment - M Only | 90-61 | M | Option I, II, III, IV |
| Retirees' Lumpsum Payment - M+1 | 90-61 | M+1 | Option I, II, III, IV |
| Annual Lumpsum Payment - M Only | 60-18 | M | Option I, II, III, IV |
| Annual Lumpsum Payment - M+1 | 60-18 | M+1 | Option I, II, III, IV |

### Data Transformation Required

```
FROM (Excel - Wide Format):
┌─────────────────────────────────────────────────────────────────────────────┐
│ Age │ M_Opt_I │ M_Opt_II │ M_Opt_III │ M_Opt_IV │ M+1_Opt_I │ M+1_Opt_II │...│
├─────────────────────────────────────────────────────────────────────────────┤
│ 90  │ 1232730 │ 1534550  │ 1697680   │ 3771544  │ 2003187   │ 2493644    │...│
└─────────────────────────────────────────────────────────────────────────────┘

TO (Database - Normalized):
┌────────────────────────────────────────────────────────────────────────────────┐
│ id │ age │ family_size │ payment_type │ option_1  │ option_2  │ option_3  │...│
├────────────────────────────────────────────────────────────────────────────────┤
│ 1  │ 90  │ M           │ LUMPSUM      │ 1232730.85│ 1534550.20│ 1697680.38│...│
│ 2  │ 90  │ M+1         │ LUMPSUM      │ 2003187.63│ 2493644.08│ 2758730.62│...│
│ 3  │ 89  │ M           │ LUMPSUM      │ 1300167.40│ 1618497.79│ 1790552.00│...│
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄 Step 1: Supabase Project Setup

### 1.1 Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in project details:
   - **Name:** `prmf-calculator`
   - **Database Password:** Generate a strong password (SAVE THIS!)
   - **Region:** Choose closest region (e.g., `eu-west-1` or `us-east-1`)
5. Click **"Create new project"**
6. Wait for project to be provisioned (~2 minutes)

### 1.2 Get Connection Credentials

After project creation, navigate to **Settings → API** and note:

```
Project URL: https://xxxxxxxxxxxx.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Also get the **Database Connection String** from **Settings → Database**:
```
Host: db.xxxxxxxxxxxx.supabase.co
Database: postgres
Port: 5432
User: postgres
Password: [your-database-password]
```

---

## 🗃 Step 2: Create Database Schema

### 2.1 Open SQL Editor

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**

### 2.2 Execute Schema Creation Script

```sql
-- ============================================
-- PRMF Premium Rates Database Schema
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
```

### 2.3 Verify Schema

Run this query to confirm table was created:

```sql
SELECT * FROM premium_rates LIMIT 5;
```

---

## 🐍 Step 3: Python Data Import Script

### 3.1 Install Required Packages

```bash
pip install pandas openpyxl supabase python-dotenv
```

### 3.2 Create Environment File

Create `.env` file in project root:

```env
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.3 Import Script

Create `scripts/seed_database.py`:

```python
"""
PRMF Premium Rates - Excel to Supabase Import Script
=====================================================
This script reads premium rates from Rates.xlsx and imports them to Supabase.

Usage:
    python scripts/seed_database.py
"""

import pandas as pd
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

def get_payment_type(age: int) -> str:
    """Determine payment type based on age."""
    if age >= 61:
        return "LUMPSUM"
    else:
        return "ANNUAL"

def read_excel_rates(file_path: str) -> pd.DataFrame:
    """
    Read and transform the Rates.xlsx file into a normalized DataFrame.
    
    Args:
        file_path: Path to the Rates.xlsx file
        
    Returns:
        DataFrame with columns: age, family_size, payment_type, option_1-4
    """
    # Read the Excel file
    df = pd.read_excel(file_path, sheet_name='Contribution Amounts', header=None)
    
    records = []
    
    # Process M Only - Retirees Lumpsum (rows 1-30, ages 90-61)
    for i in range(1, 31):
        age = int(df.iloc[i, 0])
        records.append({
            'age': age,
            'family_size': 'M',
            'payment_type': 'LUMPSUM',
            'option_1': float(df.iloc[i, 1]),
            'option_2': float(df.iloc[i, 2]),
            'option_3': float(df.iloc[i, 3]),
            'option_4': float(df.iloc[i, 4])
        })
    
    # Process M+1 - Retirees Lumpsum (rows 1-30, ages 90-61)
    for i in range(1, 31):
        age = int(df.iloc[i, 7])
        records.append({
            'age': age,
            'family_size': 'M+1',
            'payment_type': 'LUMPSUM',
            'option_1': float(df.iloc[i, 8]),
            'option_2': float(df.iloc[i, 9]),
            'option_3': float(df.iloc[i, 10]),
            'option_4': float(df.iloc[i, 11])
        })
    
    # Process M Only - Annual (rows 36-78, ages 60-18)
    for i in range(36, 79):
        age = int(df.iloc[i, 0])
        records.append({
            'age': age,
            'family_size': 'M',
            'payment_type': 'ANNUAL',
            'option_1': float(df.iloc[i, 1]),
            'option_2': float(df.iloc[i, 2]),
            'option_3': float(df.iloc[i, 3]),
            'option_4': float(df.iloc[i, 4])
        })
    
    # Process M+1 - Annual (rows 36-78, ages 60-18)
    for i in range(36, 79):
        age = int(df.iloc[i, 7])
        records.append({
            'age': age,
            'family_size': 'M+1',
            'payment_type': 'ANNUAL',
            'option_1': float(df.iloc[i, 8]),
            'option_2': float(df.iloc[i, 9]),
            'option_3': float(df.iloc[i, 10]),
            'option_4': float(df.iloc[i, 11])
        })
    
    return pd.DataFrame(records)

def upload_to_supabase(df: pd.DataFrame, supabase: Client) -> dict:
    """
    Upload DataFrame to Supabase premium_rates table.
    
    Args:
        df: DataFrame with premium rates
        supabase: Supabase client
        
    Returns:
        Response from Supabase
    """
    # Convert DataFrame to list of dictionaries
    records = df.to_dict('records')
    
    # Clear existing data (optional - comment out if you want to append)
    print("Clearing existing data...")
    supabase.table('premium_rates').delete().neq('id', 0).execute()
    
    # Insert records in batches
    batch_size = 50
    total_inserted = 0
    
    for i in range(0, len(records), batch_size):
        batch = records[i:i + batch_size]
        response = supabase.table('premium_rates').insert(batch).execute()
        total_inserted += len(batch)
        print(f"Inserted {total_inserted}/{len(records)} records...")
    
    return {'total_records': total_inserted}

def verify_import(supabase: Client):
    """Verify the import was successful."""
    # Count total records
    response = supabase.table('premium_rates').select('*', count='exact').execute()
    total = len(response.data)
    
    # Count by family size
    m_count = len(supabase.table('premium_rates').select('*').eq('family_size', 'M').execute().data)
    m1_count = len(supabase.table('premium_rates').select('*').eq('family_size', 'M+1').execute().data)
    
    # Count by payment type
    lumpsum_count = len(supabase.table('premium_rates').select('*').eq('payment_type', 'LUMPSUM').execute().data)
    annual_count = len(supabase.table('premium_rates').select('*').eq('payment_type', 'ANNUAL').execute().data)
    
    print("\n" + "="*50)
    print("IMPORT VERIFICATION")
    print("="*50)
    print(f"Total Records: {total}")
    print(f"  - M Only: {m_count}")
    print(f"  - M+1: {m1_count}")
    print(f"  - Lumpsum (61-90): {lumpsum_count}")
    print(f"  - Annual (18-60): {annual_count}")
    
    # Sample data check
    print("\nSample Records:")
    sample = supabase.table('premium_rates').select('*').in_('age', [90, 60, 18]).order('age', desc=True).execute()
    for record in sample.data[:6]:
        print(f"  Age {record['age']}, {record['family_size']}: {record['payment_type']} - Option I: KES {record['option_1']:,.2f}")

def main():
    """Main execution function."""
    print("="*50)
    print("PRMF Premium Rates - Supabase Import")
    print("="*50)
    
    # Validate environment variables
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env file")
        return
    
    # Initialize Supabase client
    print("\n1. Connecting to Supabase...")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("   ✓ Connected successfully")
    
    # Read Excel file
    excel_path = "Rates.xlsx"
    print(f"\n2. Reading Excel file: {excel_path}")
    df = read_excel_rates(excel_path)
    print(f"   ✓ Read {len(df)} records")
    
    # Show sample of transformed data
    print("\n3. Sample transformed data:")
    print(df.head(3).to_string(index=False))
    
    # Upload to Supabase
    print("\n4. Uploading to Supabase...")
    result = upload_to_supabase(df, supabase)
    print(f"   ✓ Uploaded {result['total_records']} records")
    
    # Verify import
    print("\n5. Verifying import...")
    verify_import(supabase)
    
    print("\n" + "="*50)
    print("IMPORT COMPLETE!")
    print("="*50)

if __name__ == "__main__":
    main()
```

---

## ✅ Step 4: Execute Import

### 4.1 Run the Import Script

```bash
cd "c:\Users\Robin Ochieng.BEN-ODHIAMBO\OneDrive - Kenbright\Attachments\projects\2026\February\PRMF Modeller"
python scripts/seed_database.py
```

### 4.2 Expected Output

```
==================================================
PRMF Premium Rates - Supabase Import
==================================================

1. Connecting to Supabase...
   ✓ Connected successfully

2. Reading Excel file: Rates.xlsx
   ✓ Read 146 records

3. Sample transformed data:
 age family_size payment_type    option_1    option_2    option_3     option_4
  90           M      LUMPSUM  1232730.85  1534550.20  1697680.38   3771544.09
  89           M      LUMPSUM  1300167.40  1618497.79  1790552.00   3977866.45
  88           M      LUMPSUM  1370014.41  1705445.99  1886743.23   4191563.60

4. Uploading to Supabase...
Clearing existing data...
Inserted 50/146 records...
Inserted 100/146 records...
Inserted 146/146 records...
   ✓ Uploaded 146 records

5. Verifying import...

==================================================
IMPORT VERIFICATION
==================================================
Total Records: 146
  - M Only: 73
  - M+1: 73
  - Lumpsum (61-90): 60
  - Annual (18-60): 86

Sample Records:
  Age 90, M: LUMPSUM - Option I: KES 1,232,730.85
  Age 90, M+1: LUMPSUM - Option I: KES 2,003,187.63
  Age 60, M: ANNUAL - Option I: KES 3,128,292.74
  Age 60, M+1: ANNUAL - Option I: KES 5,083,475.70
  Age 18, M: ANNUAL - Option I: KES 99,202.53
  Age 18, M+1: ANNUAL - Option I: KES 161,204.11

==================================================
IMPORT COMPLETE!
==================================================
```

---

## 🔍 Step 5: Verify in Supabase Dashboard

### 5.1 Check Table Data

1. Go to **Table Editor** in Supabase Dashboard
2. Select `premium_rates` table
3. Verify all 146 records are present

### 5.2 Test Queries

Run these queries in SQL Editor to verify:

```sql
-- Count total records (should be 146)
SELECT COUNT(*) as total FROM premium_rates;

-- Count by family size (should be 73 each)
SELECT family_size, COUNT(*) 
FROM premium_rates 
GROUP BY family_size;

-- Count by payment type
SELECT payment_type, COUNT(*) 
FROM premium_rates 
GROUP BY payment_type;

-- Test a specific lookup (Age 45, M, Option II)
SELECT * FROM premium_rates 
WHERE age = 45 AND family_size = 'M';

-- Verify age ranges
SELECT 
    payment_type,
    MIN(age) as min_age,
    MAX(age) as max_age
FROM premium_rates
GROUP BY payment_type;
```

### 5.3 Expected Query Results

| Query | Expected Result |
|-------|-----------------|
| Total Count | 146 records |
| M Only | 73 records |
| M+1 | 73 records |
| LUMPSUM | 60 records (ages 61-90 × 2 family sizes) |
| ANNUAL | 86 records (ages 18-60 × 2 family sizes) |
| LUMPSUM Age Range | 61-90 |
| ANNUAL Age Range | 18-60 |

---

## 📋 Checklist

### Pre-Import
- [ ] Supabase account created
- [ ] New project created (`prmf-calculator`)
- [ ] Database password saved securely
- [ ] Connection credentials obtained
- [ ] `.env` file created with credentials

### Schema Setup
- [ ] SQL Editor opened
- [ ] Schema creation script executed
- [ ] Table `premium_rates` created
- [ ] Indexes created
- [ ] RLS policy created

### Data Import
- [ ] Python packages installed (`pandas`, `openpyxl`, `supabase`, `python-dotenv`)
- [ ] Import script created (`scripts/seed_database.py`)
- [ ] Script executed successfully
- [ ] 146 records imported

### Verification
- [ ] Total record count verified (146)
- [ ] Family size distribution verified (73/73)
- [ ] Payment type distribution verified (60/86)
- [ ] Sample data spot-checked
- [ ] Age range boundaries verified

---

## 🚨 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError: No module named 'supabase'` | Run `pip install supabase` |
| `Invalid API key` | Check `.env` file has correct `SUPABASE_SERVICE_KEY` |
| `RLS policy error` | Use Service Role Key (not Anon Key) for imports |
| `Duplicate key error` | Clear table first or add `ON CONFLICT` clause |
| `Connection timeout` | Check network/firewall settings |

### Reset and Re-import

If you need to start fresh:

```sql
-- Clear all data
TRUNCATE TABLE premium_rates RESTART IDENTITY;

-- Or drop and recreate
DROP TABLE IF EXISTS premium_rates;
-- Then run schema creation script again
```

---

## 📎 Files Created

After completing this plan, you should have:

```
PRMF Modeller/
├── .env                           # Supabase credentials (DO NOT COMMIT)
├── Rates.xlsx                     # Source data
├── scripts/
│   └── seed_database.py           # Import script
└── Project Plan/
    ├── PROJECT_PLAN.md            # Main project plan
    └── DATABASE_SETUP_PLAN.md     # This document
```

---

## 🔐 Security Notes

1. **Never commit `.env` to Git** - Add to `.gitignore`
2. **Use Service Role Key only for server-side scripts** - Never expose in frontend
3. **Use Anon Key for frontend** - It's safe for client-side use with RLS
4. **RLS is enabled** - Public can only read, not write

---

**Document Version:** 1.0  
**Last Updated:** January 21, 2026
