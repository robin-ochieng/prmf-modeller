import pandas as pd

# Path to the Excel file
excel_file = "Rates.xlsx"

# Read all sheet names
xl = pd.ExcelFile(excel_file)
print("=" * 60)
print("EXCEL FILE ANALYSIS: Rates.xlsx")
print("=" * 60)
print(f"\nNumber of sheets: {len(xl.sheet_names)}")
print(f"Sheet names: {xl.sheet_names}")

# Read and display each sheet
for sheet_name in xl.sheet_names:
    print("\n" + "=" * 60)
    print(f"SHEET: {sheet_name}")
    print("=" * 60)
    
    df = pd.read_excel(excel_file, sheet_name=sheet_name)
    
    print(f"\nShape: {df.shape[0]} rows x {df.shape[1]} columns")
    print(f"\nColumns: {list(df.columns)}")
    print(f"\nData Types:\n{df.dtypes}")
    print(f"\nFirst 20 rows:")
    print(df.head(20).to_string())
    
    # Show basic statistics for numeric columns
    numeric_cols = df.select_dtypes(include=['number']).columns
    if len(numeric_cols) > 0:
        print(f"\nBasic Statistics for Numeric Columns:")
        print(df[numeric_cols].describe().to_string())
    
    # Check for missing values
    missing = df.isnull().sum()
    if missing.any():
        print(f"\nMissing Values:")
        print(missing[missing > 0])

print("\n" + "=" * 60)
print("END OF ANALYSIS")
print("=" * 60)
