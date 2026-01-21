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
    print("   Processing M Only - Lumpsum (ages 90-61)...")
    for i in range(1, 31):
        try:
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
        except (ValueError, TypeError) as e:
            print(f"   Warning: Skipping row {i} (M Lumpsum): {e}")
    
    # Process M+1 - Retirees Lumpsum (rows 1-30, ages 90-61)
    print("   Processing M+1 - Lumpsum (ages 90-61)...")
    for i in range(1, 31):
        try:
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
        except (ValueError, TypeError) as e:
            print(f"   Warning: Skipping row {i} (M+1 Lumpsum): {e}")
    
    # Process M Only - Annual (rows 36-78, ages 60-18)
    print("   Processing M Only - Annual (ages 60-18)...")
    for i in range(36, 79):
        try:
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
        except (ValueError, TypeError) as e:
            print(f"   Warning: Skipping row {i} (M Annual): {e}")
    
    # Process M+1 - Annual (rows 36-78, ages 60-18)
    print("   Processing M+1 - Annual (ages 60-18)...")
    for i in range(36, 79):
        try:
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
        except (ValueError, TypeError) as e:
            print(f"   Warning: Skipping row {i} (M+1 Annual): {e}")
    
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
    
    # Clear existing data
    print("   Clearing existing data...")
    try:
        supabase.table('premium_rates').delete().neq('id', 0).execute()
    except Exception as e:
        print(f"   Note: Could not clear existing data (table may be empty): {e}")
    
    # Insert records in batches
    batch_size = 50
    total_inserted = 0
    
    for i in range(0, len(records), batch_size):
        batch = records[i:i + batch_size]
        response = supabase.table('premium_rates').insert(batch).execute()
        total_inserted += len(batch)
        print(f"   Inserted {total_inserted}/{len(records)} records...")
    
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
    
    print("\n" + "=" * 50)
    print("IMPORT VERIFICATION")
    print("=" * 50)
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
    print("=" * 50)
    print("PRMF Premium Rates - Supabase Import")
    print("=" * 50)
    
    # Validate environment variables
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("\nERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env file")
        print("\nPlease create a .env file in the project root with:")
        print("  SUPABASE_URL=https://your-project.supabase.co")
        print("  SUPABASE_SERVICE_KEY=your-service-role-key")
        return
    
    # Initialize Supabase client
    print("\n1. Connecting to Supabase...")
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("   ✓ Connected successfully")
    except Exception as e:
        print(f"   ✗ Connection failed: {e}")
        return
    
    # Read Excel file
    excel_path = "Rates.xlsx"
    print(f"\n2. Reading Excel file: {excel_path}")
    try:
        df = read_excel_rates(excel_path)
        print(f"   ✓ Read {len(df)} records")
    except FileNotFoundError:
        print(f"   ✗ File not found: {excel_path}")
        return
    except Exception as e:
        print(f"   ✗ Error reading file: {e}")
        return
    
    # Show sample of transformed data
    print("\n3. Sample transformed data:")
    print(df.head(3).to_string(index=False))
    
    # Upload to Supabase
    print("\n4. Uploading to Supabase...")
    try:
        result = upload_to_supabase(df, supabase)
        print(f"   ✓ Uploaded {result['total_records']} records")
    except Exception as e:
        print(f"   ✗ Upload failed: {e}")
        return
    
    # Verify import
    print("\n5. Verifying import...")
    try:
        verify_import(supabase)
    except Exception as e:
        print(f"   ✗ Verification failed: {e}")
    
    print("\n" + "=" * 50)
    print("IMPORT COMPLETE!")
    print("=" * 50)


if __name__ == "__main__":
    main()
