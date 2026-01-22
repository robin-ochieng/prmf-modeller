"""
Verify Database Data Completeness
==================================
This script checks if all 146 required premium rate records exist in Supabase.
Expected: 73 ages (18-90) × 2 family sizes (M, M+1) = 146 records
"""

import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")


def verify_data():
    """Verify all required premium rate records exist."""
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Error: Missing Supabase credentials in .env file")
        return False
    
    print("🔍 Connecting to Supabase...")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Fetch all records
    print("📊 Fetching premium_rates table...")
    response = supabase.table('premium_rates').select('age, family_size').execute()
    
    if not response.data:
        print("❌ No data found in premium_rates table!")
        print("   Run: python scripts/seed_database.py")
        return False
    
    records = response.data
    print(f"   Found {len(records)} records")
    
    # Build a set of existing (age, family_size) combinations
    existing = {(r['age'], r['family_size']) for r in records}
    
    # Check for missing records
    missing = []
    expected_count = 0
    
    for age in range(18, 91):
        for family_size in ['M', 'M+1']:
            expected_count += 1
            if (age, family_size) not in existing:
                missing.append((age, family_size))
    
    print(f"\n📋 Expected records: {expected_count}")
    print(f"✅ Found records: {len(records)}")
    print(f"❌ Missing records: {len(missing)}")
    
    if missing:
        print("\n⚠️ Missing age/family_size combinations:")
        # Group by age ranges for readability
        m_missing = [age for age, fs in missing if fs == 'M']
        m1_missing = [age for age, fs in missing if fs == 'M+1']
        
        if m_missing:
            print(f"   M (Principal Only): {summarize_ages(m_missing)}")
        if m1_missing:
            print(f"   M+1 (Principal + Spouse): {summarize_ages(m1_missing)}")
        
        print("\n💡 To fix: Run python scripts/seed_database.py")
        return False
    
    print("\n✅ All required records are present!")
    
    # Verify payment types are correct
    print("\n🔍 Verifying payment types...")
    payment_check = supabase.table('premium_rates').select('age, payment_type').execute()
    
    payment_errors = []
    for record in payment_check.data:
        expected_type = 'LUMPSUM' if record['age'] >= 61 else 'ANNUAL'
        if record.get('payment_type') != expected_type:
            payment_errors.append((record['age'], record.get('payment_type'), expected_type))
    
    if payment_errors:
        print(f"❌ Found {len(payment_errors)} records with incorrect payment_type:")
        for age, actual, expected in payment_errors[:10]:
            print(f"   Age {age}: has '{actual}', should be '{expected}'")
        return False
    
    print("✅ All payment types are correct!")
    return True


def summarize_ages(ages: list) -> str:
    """Summarize a list of ages into ranges."""
    if not ages:
        return "None"
    
    ages = sorted(ages)
    if len(ages) <= 5:
        return str(ages)
    
    return f"Ages {ages[0]}-{ages[-1]} ({len(ages)} ages)"


if __name__ == "__main__":
    print("=" * 50)
    print("PRMF Database Verification")
    print("=" * 50)
    
    success = verify_data()
    
    print("\n" + "=" * 50)
    if success:
        print("✅ Database verification PASSED")
    else:
        print("❌ Database verification FAILED")
    print("=" * 50)
