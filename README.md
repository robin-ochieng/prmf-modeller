# KMHFL/KMHFR Facilities Data Extractor

A Python script that extracts the full facility dataset from the Kenya Master Health Facility List (KMHFL/KMHFR) public API and saves it to an Excel file.

## Features

- Automatically detects and connects to the working KMHFL API endpoint
- Handles paginated responses (Django REST Framework style)
- Flattens nested JSON data into readable Excel columns
- Robust error handling with retries and timeout support
- CLI options for customization
- Progress logging during extraction

## Requirements

- Python 3.9+
- Internet connection

## Installation

1. Clone or download this repository

2. Create a virtual environment (recommended):
   ```bash
   python -m venv .venv
   
   # On Windows:
   .venv\Scripts\activate
   
   # On Linux/Mac:
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Basic Usage

```bash
python facilities_to_excel.py
```

This will create `kmhfr_facilities.xlsx` with all published, non-classified facilities.

### Custom Output File

```bash
python facilities_to_excel.py --out my_facilities.xlsx
```

### Command Line Options

| Option | Default | Description |
|--------|---------|-------------|
| `--out` | `kmhfr_facilities.xlsx` | Output Excel file path |
| `--base-url` | Auto-detect | Force a specific API base URL |
| `--sleep` | `0.2` | Sleep time between API requests (seconds) |
| `--page-size` | `100` | Number of records per page |
| `--no-published-filter` | False | Don't filter by `is_published=true` |
| `--no-classified-filter` | False | Don't filter by `is_classified=false` |
| `--timeout` | `60` | Request timeout in seconds |
| `--retries` | `3` | Number of retries for failed requests |
| `-v, --verbose` | False | Enable verbose/debug logging |

### Examples

```bash
# Extract with custom settings
python facilities_to_excel.py --out facilities_2026.xlsx --sleep 0.5

# Extract ALL facilities (no filters)
python facilities_to_excel.py --no-published-filter --no-classified-filter

# Force a specific API endpoint
python facilities_to_excel.py --base-url https://api.kmhfr.health.go.ke

# Verbose output for debugging
python facilities_to_excel.py -v

# Increase timeout for slow connections
python facilities_to_excel.py --timeout 120 --retries 5
```

## API Endpoints

The script tries these base URLs in order:
1. `https://api.kmhfr.health.go.ke`
2. `https://kmhfl.health.go.ke`

The facilities endpoint is: `/api/facilities/facilities/`

## Output Format

The output Excel file contains a single sheet named "Facilities" with all facility data. Nested JSON fields are flattened using dot notation (e.g., `county.name`, `facility_type.name`).

## Troubleshooting

### 403 Forbidden Error
- The API may require authentication or have rate limits
- Try using a different `--base-url`
- Increase `--sleep` time between requests

### 404 Not Found Error
- The API structure may have changed
- Check if the KMHFL website is accessible
- Try a different `--base-url`

### Connection Timeout
- Increase `--timeout` value
- Check your internet connection
- Try again later (server may be busy)

### Empty Output
- Check if filters are too restrictive
- Try `--no-published-filter --no-classified-filter`
- Use `-v` for verbose logging to see what's happening

## License

This project is provided as-is for educational and data extraction purposes.

## Data Source

- **Website**: https://kmhfl.health.go.ke/public/facilities
- **API**: Kenya Master Health Facility List (KMHFL) / Kenya Master Health Facility Registry (KMHFR)
